import { shuffle } from "../../helper";
import Dig from "./Dig";
//import dig from "./Dig";

type directions = ("left" | "right" | "top" | "bottom")

class Cell extends PIXI.Container {

    private right: PIXI.Graphics;
    private bottom: PIXI.Graphics;
    private left: PIXI.Graphics;
    private top: PIXI.Graphics;

    private dealt: boolean = false;

    private maze_start: boolean = false;
    private maze_prev: Cell

    public size: number;

    private game: Dig;

    private n: { left: Cell, right: Cell, top: Cell, bottom: Cell } = {
        left: null,
        right: null,
        top: null,
        bottom: null,
    }

    constructor(size: number, x: number, y: number, game: Dig) {
        super()

        this.size = size;
        this.game = game;

        this.right = new PIXI.Graphics();
        this.right.lineStyle(4, 0)
        this.right.moveTo(size, 0)
        this.right.lineTo(size, size)
        this.addChild(this.right)

        this.bottom = new PIXI.Graphics();
        this.bottom.moveTo(0, size)
        this.bottom.lineStyle(4, 0)
        this.bottom.lineTo(size, size)
        this.addChild(this.bottom)

        this.left = new PIXI.Graphics();
        this.left.moveTo(0, 0)
        this.left.lineStyle(4, 0)
        this.left.lineTo(0, size)
        this.addChild(this.left)

        this.top = new PIXI.Graphics();
        this.top.lineStyle(4, 0)
        this.top.moveTo(0, 0)
        this.top.lineTo(size, 0)
        this.addChild(this.top)
    }

    public get centerx(): number {
        return this.x + this.size / 2
    }

    public get centery(): number {
        return this.y + this.size / 2
    }

    /**
     * Set or get a neighbor   
     * @param which Direction (left|right|top|bottom)
     * @param cell Populate to set the neighbor to this cell
     */
    public neighbor(which: directions, cell?: Cell): Cell {
        if (cell) {
            this.n[which] = cell
            if (which === "left") {
                cell.neighbor("right", this)
            }
            if (which === "top") {
                cell.neighbor("bottom", this)
            }
        } else {
            return this.n[which]
        }
    }

    public openTo(cell: Cell): boolean {
        if (this.neighbor("left") === cell) {
            return !this.left.visible
        } else if (this.neighbor("right") === cell) {
            return !this.right.visible
        } else if (this.neighbor("top") === cell) {
            return !this.top.visible
        } else if (this.neighbor("bottom") === cell) {
            return !this.bottom.visible
        }

        // Special case : diagonal
        if (this.neighbor("left") !== cell && this.neighbor("right") !== cell && this.neighbor("top") !== cell && this.neighbor("bottom") !== cell) {
            if (this.neighbor("left") && this.neighbor("left").neighbor("top") === cell) {
                console.log("left top");
                return !this.left.visible && !this.neighbor("left").top.visible
            }
            if (this.neighbor("top") && this.neighbor("top").neighbor("right") === cell) {
                console.log("top right");
                return !this.top.visible && !this.neighbor("top").right.visible
            }
            if (this.neighbor("right") && this.neighbor("right").neighbor("bottom") === cell) {
                console.log("right bottom");
                return !this.right.visible && !this.neighbor("right").bottom.visible
            }
            if (this.neighbor("bottom") && this.neighbor("bottom").neighbor("left") === cell) {
                console.log("bottom left");
                return !this.bottom.visible && !this.neighbor("bottom").left.visible
            }
        }

        return false;
    }

    /**
     * randomOpen
     */
    public randomOpen() {
        let possible: directions[] = shuffle(["left", "right", "top", "bottom"]) as directions[]

        for (let i = 0; i < possible.length; i++) {
            if (this.neighbor(possible[i]) && this[possible[i]].visible) {
                this[possible[i]].visible = false;
                this.neighbor(possible[i])[this.opposite(possible[i])].visible = false;

                break;
            }
        }
    }

    private opposite(direction: directions): directions {
        if (direction === "left") return "right"
        if (direction === "right") return "left"
        if (direction === "top") return "bottom"
        if (direction === "bottom") return "top"
    }

    /**
     * @return String (left | right | top | bottom)
     */
    private constructNext(): directions {
        let possible: directions[] = shuffle(["left", "right", "top", "bottom"]) as directions[]

        for (let i = 0; i < possible.length; i++) {
            if (this.neighbor(possible[i]) && !this.neighbor(possible[i]).dealt) {
                return possible[i]
            }
        }

        return undefined
    }

    public start(): void {
        this.maze_start = true;

        this.construct()
    }

    private construct(): void {
        const was_dealt = this.dealt
        this.dealt = true;
        let next: directions = this.constructNext()
        if (next) {
            if (next === "left") {
                this.left.visible = false;
                this.neighbor(next).right.visible = false;
            } else if (next === "right") {
                this.right.visible = false;
                this.neighbor(next).left.visible = false;
            } else if (next === "top") {
                this.top.visible = false;
                this.neighbor(next).bottom.visible = false;
            } else if (next === "bottom") {
                this.bottom.visible = false;
                this.neighbor(next).top.visible = false;
            }
            this.neighbor(next).maze_prev = this;
            this.neighbor(next).construct()
        } else {
            if (!was_dealt) {
                this.game.registerItemPlaceholder(this)
            }
            if (!this.maze_prev.maze_start) {
                this.maze_prev.construct();
            }
        }
    }

    public kill() {
        this.parent.removeChild(this)
    }
}

export default Cell