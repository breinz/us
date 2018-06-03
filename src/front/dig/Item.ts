import Cell from "./Cell";
import dig from "./Dig";
import { ItemModel } from "../../back/item/model";

export default class Item extends PIXI.Sprite {
    
    private __texture = PIXI.Texture.fromImage("img/items.png")

    private cell: Cell;

    public data: ItemModel

    constructor(cell: Cell) {
        super()

        this.cell = cell;

        this.data = dig.getRandomItem();

        this.texture = this.__texture.clone()

        if (!this.__texture.baseTexture.hasLoaded) {
            this._texture.baseTexture.once("loaded", this.draw.bind(this))
        } else {
            this.draw()
        }
    }

    private draw() {
        this.texture.frame = new PIXI.Rectangle(this.data.x*16, this.data.y*16, 16, 16)

        this.anchor.set(.5, .5)
        this.x = this.cell.x + this.cell.size/2
        this.y = this.cell.y + this.cell.size/2
        dig.layer.addChild(this)
    }

    public grab() {
        dig.grab(this)
        this.visible = false;
    }

    public kill() {
        dig.layer.removeChild(this)
    }
}