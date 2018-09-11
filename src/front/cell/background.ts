import dispatcher from "../dispatcher";
import ABuilding from "../buildings/ABuilding";
import { TweenLite, Linear } from "gsap";
import { CellModel } from "../../back/cell/model";

class Background {

    private container: PIXI.Container;

    private cell: PIXI.Container;

    public init(app: PIXI.Application, data: CellModel) {

        this.container = new PIXI.Container();
        app.stage.addChild(this.container);

        this.container.interactive = true;
        this.container.on("rightclick", this.onRightClick);

        this.cell = new PIXI.Container();
        this.container.addChild(this.cell);

        //var t = PIXI.extras.TilingSprite.from("img/backgrounds/grass.jpg", 560, 560);
        var t = PIXI.Sprite.fromImage(`img/backgrounds/${data.ground}.png`);
        this.cell.addChild(t)

        var r = PIXI.Sprite.fromImage(`img/backgrounds/${(<CellModel>data.neighbors.right).ground}-r.png`);
        this.cell.addChild(r)

        var l = PIXI.Sprite.fromImage(`img/backgrounds/${(<CellModel>data.neighbors.left).ground}-l.png`);
        this.cell.addChild(l)

        var t = PIXI.Sprite.fromImage(`img/backgrounds/${(<CellModel>data.neighbors.top).ground}-t.png`);
        this.cell.addChild(t)

        var b = PIXI.Sprite.fromImage(`img/backgrounds/${(<CellModel>data.neighbors.bottom).ground}-b.png`);
        this.cell.addChild(b)
    }

    private onRightClick() {
        dispatcher.dispatch(dispatcher.SELECT_BACKGROUND)
    }
}

export default new Background();