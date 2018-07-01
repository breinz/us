import Cell from "./Cell";
//import dig from "./Dig";
import { ItemModel } from "../../back/item/model";
import Dig from "./Dig";

export default class Item extends PIXI.Sprite {

    private __texture = PIXI.Texture.fromImage("img/items.png")

    private cell: Cell;

    public data: ItemModel

    private game: Dig;

    constructor(cell: Cell, game: Dig) {
        super()

        this.game = game;

        this.cell = cell;

        this.data = this.game.getRandomItem();

        this.texture = this.__texture.clone()

        if (!this.__texture.baseTexture.hasLoaded) {
            this._texture.baseTexture.once("loaded", this.draw.bind(this))
        } else {
            this.draw()
        }
    }

    private draw() {
        this.texture.frame = new PIXI.Rectangle(this.data.x * 16, this.data.y * 16, 16, 16)

        this.anchor.set(.5, .5)
        this.x = this.cell.x + this.cell.size / 2
        this.y = this.cell.y + this.cell.size / 2
        this.game.container.addChild(this)
    }

    public reveal() {
        this.game.reveal(this)
        this.visible = false;
    }

    /**
     * Make garbage collectable
     */
    public kill() {
        this.game.container.removeChild(this)
    }
}