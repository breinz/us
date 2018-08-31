import MapAdmin from "./MapAdmin";
import GroundBtn from "./GroundBtn";
import BuildingBtn from "./BuildingBtn";
import { GROUND } from "../../../const";

export default class Cell extends PIXI.Container {

    private app: MapAdmin;

    private bg: PIXI.Graphics;

    public ground: string;
    public buildings: PIXI.Text;

    private w: number;
    private h: number;

    constructor(w: number, h: number, app: MapAdmin, state: string) {
        super();

        this.app = app;
        this.w = w;
        this.h = h;

        this.ground = state ? state.substr(0, 1) : "g";

        this.bg = new PIXI.Graphics()
        this.bg.beginFill(GROUND.COLORS[GROUND.LETTERS.indexOf(this.ground)])
        this.bg.drawRect(0, 0, w, h)
        this.addChild(this.bg);

        this.buildings = new PIXI.Text(state ? state.substr(1) : "", { fontSize: 12, wordWrap: true, wordWrapWidth: w - 4, breakWords: true, lineHeight: 12 })
        this.buildings.x = 2;
        this.addChild(this.buildings)

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

            this.ground = element.label;
        } else if (this.app.element.action === "building") {
            let element = this.app.element as BuildingBtn;
            this.buildings.text += element.letter;
        } else if (this.app.element.action === "empty") {
            this.buildings.text = "";
        }

        this.app.update()
    }
}