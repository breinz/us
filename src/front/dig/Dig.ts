import Cell from "./Cell";
import User from "./User";
import Item from "./Item";
import End from "./End";
import dispatcher from "../dispatcher";
import axios from "axios";
import { cell as game, cell } from "../main";
import { ItemModel } from "../../back/item/model";
import Trace from "./Trace";
import Background from "./Background";
import { TweenLite, Linear } from "gsap";

export default class Dig extends PIXI.Container {

    /** Main container that will be added or removed when the game starts/end */
    public container: PIXI.Container

    private arCells: Cell[][]

    private size: number = 4
    private cell_size: number

    private user: User
    private background: Background
    public end: End

    public arItems: Item[]
    private arItemsRevealed: Item[]

    private arAvailableItems: ItemModel[];
    private availableItems_count: number;

    private _initialized: boolean = false;

    private hide_fct: () => void;
    private keep_fct: () => void;

    private interval: NodeJS.Timer;

    constructor() {
        super()

        this.hide_fct = this.hide.bind(this)
        this.keep_fct = this.nextLevel.bind(this)

        dispatcher.on(dispatcher.DIG, this.show.bind(this))
    }

    private initialize() {
        this.container = new PIXI.Container()

        // Prepare the background
        this.container.addChild(new Background())

        this.container.addChild(new Trace())

        this.user = new User(this)
        this.container.addChild(this.user)

        this._initialized = true;
    }

    /**
     * Show
     */
    private show() {
        if (!this._initialized) {
            this.initialize()
        }

        this.addChild(this.container)

        this.start()

        this.container.alpha = 1;
        TweenLite.from(this.container, .5, {
            alpha: 0,
            ease: Linear.easeIn
        });

        dispatcher.on(dispatcher.DIG_END, this.hide_fct)
        dispatcher.on(dispatcher.DIG_NEXT_LEVEL, this.keep_fct)

        this.interval = setInterval(() => {
            cell.user_controller.usePA(1, true)
        }, 500 * cell.user_data.dig.pa)
    }

    /**
    * Hide
    */
    private hide(): void {
        TweenLite.to(this.container, .5, {
            alpha: 0,
            ease: Linear.easeIn,
            onComplete: () => {
                this.removeChild(this.container)
            }
        })

        dispatcher.off(dispatcher.DIG_END, this.hide_fct)
        dispatcher.off(dispatcher.DIG_NEXT_LEVEL, this.keep_fct)

        clearInterval(this.interval)
    }

    /**
     * Starts the dig game
     */
    public async start() {

        // Register that the used digged
        const count = await axios.post("/api/actions/dig")

        // Prepare the items that can appear
        this.compileAvailableItems(count.data.dig_count - 1);

        // --------------------------------------------------
        // Display
        // --------------------------------------------------

        // Prepare the level
        const start_cell = this.createLevel();

        this.user.spawn(start_cell);
    }

    /**
     * Restart after a level
     */
    private nextLevel(): void {
        // Register that the used starts a new level
        axios.post("/api/actions/dig/level")

        this.size++;

        const start_cell = this.createLevel()

        this.user.spawn(start_cell);
    }

    /**
     * Creates a new level
     */
    private createLevel(): Cell {

        this.arCells = []
        this.arItems = []
        this.arItemsRevealed = []

        const size = game.app.stage.width;

        this.cell_size = (size - 4) / this.size;

        let prev: Cell;
        let prevs: Cell[] = []

        let cell: Cell;
        let ar: Cell[] = []

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                // Create the cell
                cell = new Cell(this.cell_size, y, x, this)
                cell.x = this.cell_size * x + 2;
                cell.y = this.cell_size * y + 2;
                this.container.addChild(cell)

                // Set its neighbors
                if (prev && x > 0) {
                    cell.neighbor("left", prev)
                }
                if (y > 0) {
                    cell.neighbor("top", prevs.shift())
                }

                prev = cell;
                prevs.push(cell)
                ar.push(cell)
            }
            this.arCells.push(ar)
            ar = []
        }

        // Find the starting cell
        const start_cell = this.arCells[0][Math.floor(Math.random() * this.size)]
        start_cell.start();

        // Open some random cells
        for (let i = 0; i < this.size * 2; i++) {
            this.arCells[Math.floor(Math.random() * this.size)][Math.floor(Math.random() * this.size)].randomOpen();
        }

        return start_cell;
    }

    /**
     * Reach the end of a level
     */
    public reachEnd() {
        // Kill all un-grabbed items
        for (let i = 0; i < this.arItems.length; i++) {
            this.arItems[i].kill();
        }

        // Kill all cells
        for (let i = 0; i < this.arCells.length; i++) {
            for (let j = 0; j < this.arCells[i].length; j++) {
                this.arCells[i][j].kill();
            }
        }

        // Kill end
        this.end.kill()
        this.end = undefined

        // Kill trace
        //this.trace.kill();

        // Kill user
        //this.user.kill()
        this.user.visible = false;

        dispatcher.dispatch(dispatcher.DIG_END_LEVEL)
    }

    /**
     * Find a cell base on a position on the board
     * @param x 
     * @param y 
     */
    public findCell(x: number, y: number): Cell {
        x = Math.floor(x / this.cell_size)
        y = Math.floor(y / this.cell_size)

        try {
            return this.arCells[y][x]
        } catch (e) {
            return null;
        }
    }

    // **************************************************
    // Items
    // **************************************************

    /**
     * New cell that can hold an item (a dead end)
     * @param cell The cell
     */
    public registerItemPlaceholder(cell: Cell) {
        if (this.end === undefined) {
            this.end = new End(cell)
            this.container.addChild(this.end)
        } else {
            this.arItems.push(new Item(cell, this));
        }
    }

    /**
     * Reveal an item
     * @param item The item revealed
     */
    public reveal(item: Item) {
        for (let index = this.arItems.length; index >= 0; index--) {
            if (this.arItems[index] === item) {
                this.arItems.splice(index, 1)
                this.arItemsRevealed.push(item)
            }
        }
        dispatcher.dispatch(dispatcher.DIG_UNDIG_ITEM, item.data)
    }

    /**
     * Place all items in an array from which we can then randomly pick an object
     * @param dig_count How many times the user digged
     */
    private compileAvailableItems(dig_count: number) {
        // copy items
        this.arAvailableItems = JSON.parse(JSON.stringify(game.items))

        this.availableItems_count = 0;

        this.arAvailableItems.forEach(item => {
            item.frequency += dig_count * item.frequency_change
            if (item.frequency_change === 1) {
                item.frequency = Math.min(item.frequency_limit, item.frequency)
            } else if (item.frequency_change === -1) {
                item.frequency = Math.max(item.frequency_limit, item.frequency)
            }
            this.availableItems_count += item.frequency
        });
    }

    /**
     * Get a random item
     */
    public getRandomItem(): ItemModel {

        let rand = Math.floor(Math.random() * this.availableItems_count)

        let count = 0;

        for (let i = 0; i < this.arAvailableItems.length; i++) {
            const item = this.arAvailableItems[i];
            count += item.frequency
            if (rand <= count) {
                return item
            }

        }

        console.error("We should never reach this point !!!!!");
        return this.arAvailableItems[this.arAvailableItems.length - 1]
    }
}

//export default new Dig()