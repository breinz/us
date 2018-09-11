//import * as PIXI from "pixi.js"
import Cell from "./Cell";

export default class GridAdmin {

    public app: PIXI.Application;

    private bg: PIXI.Container;

    private grid: PIXI.Container;

    public draw: number = NaN;

    private arCells: Cell[] = [];

    constructor() {
        PIXI.utils.skipHello();
        this.app = new PIXI.Application({
            width: 560,
            height: 560,
            transparent: true,
            antialias: true
        })
        document.getElementById("grid-admin").appendChild(this.app.view)

        this.app.stage.interactive = true;

        this.bg = new PIXI.Container()
        this.app.stage.addChild(this.bg)

        this.grid = new PIXI.Container()
        this.app.stage.addChild(this.grid);

        this.grid.interactive = true;
        this.grid.on("mouseup", this.onMouseUp.bind(this))

        this.drawGrid();
    }

    public load(url: string) {
        this.bg.removeChildren()
        this.bg.addChild(PIXI.Sprite.fromImage(url));
    }

    private update() {
        let str: string = "";
        let value: number;
        let count = 0;
        let el: Cell;
        for (let i = 0; i < this.arCells.length; i++) {
            el = this.arCells[i]
            if (value === undefined) {
                str += el.value;
                str += ",";
                value = el.value;
            } else {
                if (value != el.value) {
                    str += count;
                    //str += value;
                    str += ",";

                    count = 0;
                    value = el.value;
                }
            }
            count++;
        }
        str += count;
        str += value;
        (<HTMLInputElement>document.getElementById("output")).value = str;

        console.log(str);
    }

    private drawGrid() {
        let cell;
        for (let i = 0; i < 560 / 20; i++) {
            for (let j = 0; j < 560 / 20; j++) {
                cell = new Cell(this);
                cell.x = j * 20;
                cell.y = i * 20;
                this.grid.addChild(cell)

                this.arCells.push(cell)
            }
        }
    }

    private onMouseUp() {
        this.draw = NaN;
        this.update()
    }
}