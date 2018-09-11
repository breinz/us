
import { ItemModel } from "../../back/item/model";
import dispatcher from "../dispatcher";

export default class Item extends PIXI.Sprite {

    private item: ItemModel;

    private __texture: PIXI.Texture;

    constructor(item: ItemModel) {
        super()

        this.item = item;

        this.__texture = PIXI.Texture.fromImage("img/items.png");
        this.texture = this.__texture.clone();

        if (!this.__texture.baseTexture.hasLoaded) {
            this._texture.baseTexture.once("loaded", () => this.draw())
        } else {
            this.draw()
        }
    }

    private draw() {
        this.texture.frame = new PIXI.Rectangle(this.item.x * 16, this.item.y * 16, 16, 16)

        this.anchor.set(.5, .5)

        this.interactive = true;
        this.hitArea = new PIXI.Circle(0, 0, 20)

        this.on("rightclick", () => this.onClick());
    }

    private onClick() {
        dispatcher.dispatch(dispatcher.SELECT_ITEM, this.item, "cell")
    }
}