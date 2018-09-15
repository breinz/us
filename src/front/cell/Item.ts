import dispatcher from "../dispatcher";
import { CellItemModel } from "../../back/cell/model";
import { cell } from "../main";
import messages from "../../SocketMessages";

export default class Item extends PIXI.Sprite {

    private item: CellItemModel;

    private __texture: PIXI.Texture;

    private grabbed_fct: (item: CellItemModel) => void;
    private click_fct: () => void;


    constructor(item: CellItemModel) {
        super()

        this.item = item;

        this.__texture = PIXI.Texture.fromImage("img/items.png");
        this.texture = this.__texture.clone();

        if (!this.__texture.baseTexture.hasLoaded) {
            this._texture.baseTexture.once("loaded", () => this.draw())
        } else {
            cell.app.ticker.addOnce(() => this.draw())
        }

        this.visible = false;

        this.click_fct = () => this.onClick();
        this.grabbed_fct = (item) => this.onGrabbed(item);

    }

    private listen() {
        cell.cell_socket.on(messages.Item.GRABBED, this.grabbed_fct)
        this.on("rightclick", this.click_fct);
    }
    /**
     * Prepare for garbage collection
     */
    public destroy() {
        cell.cell_socket.off(messages.Item.GRABBED, this.grabbed_fct)
        this.off("rightclick", this.click_fct);
        super.destroy()
    }

    private draw() {
        this.texture.frame = new PIXI.Rectangle(this.item.item.x * 16, this.item.item.y * 16, 16, 16)

        this.anchor.set(.5, .5)

        this.interactive = true;
        this.hitArea = new PIXI.Circle(0, 0, 20)

        this.visible = true;

        this.listen();
    }

    private onClick() {
        dispatcher.dispatch(dispatcher.ITEM_SELECTED, this.item, "cell")
    }

    /**
     * One item has been grabbed by someone
     * @param item The item grabbed
     */
    private onGrabbed(item: CellItemModel) {
        if (item._id === this.item._id) {

            this.destroy();
        }
    }
}