import Cell from "./Cell";
import User from "./User";
import Item from "./Item";
import End from "./End";
import dispatcher from "../dispatcher";
import axios from "axios";
import { cell } from "../main";
import { ItemModel } from "../../back/item/model";
import Trace from "./Trace";
import { TweenLite } from "gsap";
import Background from "./Background";

export class Dig {

    public layer: PIXI.Container;

    private rect:{width: number, height: number}

    private arCells: Cell[][]

    private size: number = 4
    private cell_size: number

    private user: User
    private trace: Trace;
    private background: Background

    public arItems: Item[]
    private arItemsGrabbed: Item[]

    public end: End

    /** @deprecated */
    private arAvailableItems: ItemModel[];
    private availableItems_count: number;

    /**
     * Initialize the dig game
     * @param layer The layer where to draw the game
     * @param rect The size of the canvas
     */
    public init(layer: PIXI.Container, rect:{width: number, height: number}) {
        this.layer = layer

        this.rect = rect

        dispatcher.on("keepDigging", this.onKeepDigging.bind(this))
    }

    /**
     * Starts the dig game
     */
    public async start() {

        // Register that the used digged
        const count = await axios.post("/api/actions/dig")

        this.compileAvailableItems(count.data.dig_count-1);

        this.arCells = []
        this.arItems = []
        this.arItemsGrabbed = []

        // --------------------------------------------------
        // Background
        this.background = new Background(this.rect);
        this.layer.addChild(this.background);

        // --------------------------------------------------
        // Cells
        this.cell_size = (this.rect.width-4)/this.size;

        let prev: Cell;
        let prevs: Cell[] = []

        let cell: Cell;
        let ar: Cell[] = []

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                // Create the cell
                cell = new Cell(this.cell_size, y, x)
                cell.x = this.cell_size*x+2;
                cell.y = this.cell_size*y+2;
                this.layer.addChild(cell)

                // Set its neighbors
                if (prev && x>0) {
                    cell.neighbor("left", prev)
                }
                if (y>0) {
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
        const start_cell = this.arCells[0][Math.floor(Math.random()*this.size)]
        start_cell.start();

        // Open a random cell
        for (let i = 0; i < this.size*2; i++) {
            this.arCells[Math.floor(Math.random()*this.size)][Math.floor(Math.random()*this.size)].randomOpen();    
        }

        // Create the user trace
        this.trace = new Trace()
        this.layer.addChild(this.trace)

        // Create the user
        this.user = new User(this, start_cell)
        this.layer.addChild(this.user)
    }

    /**
     * Find a cell base on a position on the board
     * @param x 
     * @param y 
     */
    public findCell(x: number, y: number):Cell {
        x = Math.floor(x/this.cell_size)
        y = Math.floor(y/this.cell_size)

        try {
            return this.arCells[y][x]
        } catch (e) {
            return null;
        }
    }

    /**
     * New cell that can hold an item (a dead end)
     * @param cell The cell
     */
    public registerItemPlaceholder(cell: Cell) {
        if (this.end === undefined) {
            this.end = new End(cell)
            this.layer.addChild(this.end)
        } else {
            this.arItems.push( new Item(cell) );
        }
    }

    /**
     * Grab an item
     * @param item The item grabbed
     */
    public grab(item: Item) {
        for (let index = this.arItems.length; index >= 0 ; index--) {
            if (this.arItems[index] === item) {
                this.arItems.splice(index, 1)
                this.arItemsGrabbed.push(item)
            }
        }
        dispatcher.dispatch("dig_grab", item.data)
    }

    public reachEnd() {
        // Kill all ungrabbed items
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
        this.trace.kill();

        // Kill user
        this.user.kill()

        dispatcher.dispatch("endDig")
    }

    /**
     * Restart after a level
     */
    private onKeepDigging():void {
        this.size++;
        this.start()
    }

    /**
     * Place all items in an array from which we can then randomly pick an object
     * @param dig_count HOw many times the user digged
     */
    private compileAvailableItems(dig_count: number) {
        this.arAvailableItems = JSON.parse(JSON.stringify(cell.items))

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

    public getRandomItem():ItemModel {
        let rand = Math.floor(Math.random()*this.availableItems_count)

        let count = 0;

        for (let i = 0; i < this.arAvailableItems.length; i++) {
            const item = this.arAvailableItems[i];
            count += item.frequency
            if (rand <= count) {
                return item
            }
            
        }

        console.error("We should never reach this point !!!!!");
        return this.arAvailableItems[this.arAvailableItems.length-1]
    }
}

export default new Dig()