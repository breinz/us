import MapAdmin from "./MapAdmin";
import GroundBtn from "./GroundBtn";

export default class Cell extends PIXI.Container {

    private app: MapAdmin;

    private bg: PIXI.Graphics;

    private w: number;
    private h: number;

    constructor(w: number, h: number, app: MapAdmin) {
        super();
        this.app = app;
        this.w = w;
        this.h = h;

        this.bg = new PIXI.Graphics()
        this.bg.beginFill(GroundBtn.colors[0])
        this.bg.drawRect(0, 0, w, h)
        this.addChild(this.bg);

        let border = new PIXI.Graphics();
        border.lineStyle(1);
        border.drawRect(0, 0, w, h)
        this.addChild(border);

        this.interactive = true;

        this.on("click", this.onClick.bind(this));
    }

    private onClick() {

        if (this.app.element.action === "ground") {
            let element = this.app.element as GroundBtn;
            this.bg.clear()
            this.bg.beginFill(element.color)
            this.bg.drawRect(0, 0, this.w, this.h)
        }
    }
}