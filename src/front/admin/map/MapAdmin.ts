import Cell from "./Cell";
import VContainer from "./VContainer";
import AButton from "./AButton";
import GroundBtn from "./GroundBtn";
import BuildingBtn from "./BuildingBtn";
import dispatcher from "../../dispatcher";

export default class MapAdmin {

    private app: PIXI.Application;

    public action: string;
    public element: AButton;

    constructor() {
        PIXI.utils.skipHello();
        this.app = new PIXI.Application({
            width: 860,
            height: 560,
            transparent: true,
            antialias: true
        })
        document.getElementById("map-admin").appendChild(this.app.view)

        this.app.stage.interactive = true;

        this.drawCells();
        this.drawBtn();

        dispatcher.on(AButton.click, this.onButtonClick.bind(this))
    }

    private drawCells() {
        const w = parseInt((<HTMLInputElement>document.getElementById("map-width")).value);
        const h = parseInt((<HTMLInputElement>document.getElementById("map-height")).value);

        const cw = 560 / w;
        const ch = 560 / h;

        let cell;

        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                cell = new Cell(cw, ch, this);
                cell.x = j * cw;
                cell.y = i * ch;
                this.app.stage.addChild(cell)
            }
        }
    }

    private drawBtn() {
        const btn_container = new PIXI.Container();
        btn_container.x = 560 + 50;
        this.app.stage.addChild(btn_container);

        const ff = "noto sans, lucida grande, lucida sans unicode, Geneva, Verdana, sans - serif";

        const vcontainer = new VContainer();
        btn_container.addChild(vcontainer)

        vcontainer.addChild(new GroundBtn(0));
        vcontainer.addChild(new GroundBtn(1));
        vcontainer.addChild(new GroundBtn(2));
        vcontainer.addChild(new GroundBtn(3));
        vcontainer.addChild(new GroundBtn(4));

        vcontainer.addSeparator(10);

        vcontainer.addChild(new BuildingBtn("house"));
        vcontainer.addChild(new BuildingBtn("well"));
        vcontainer.addChild(new BuildingBtn("church"));
    }

    private onButtonClick(btn: AButton) {
        this.element = btn;
    }
}