import dispatcher from "../dispatcher";
import ABuilding from "../buildings/ABuilding";
import { TweenLite, Linear } from "gsap";

class Background {

    private container: PIXI.Container;

    private cell: PIXI.Container;

    public init(app: PIXI.Application) {

        this.container = new PIXI.Container();
        app.stage.addChild(this.container);

        this.container.interactive = true;
        this.container.on("click", this.onClick);

        this.cell = new PIXI.Container();
        this.container.addChild(this.cell);

        //var t = PIXI.extras.TilingSprite.from("img/backgrounds/grass.jpg", 560, 560);
        var t = PIXI.Sprite.fromImage("img/backgrounds/grass.png");
        this.cell.addChild(t)

        var r = PIXI.Sprite.fromImage("img/backgrounds/snow-r.png");
        //this.cell.addChild(r)

        var l = PIXI.Sprite.fromImage("img/backgrounds/desert-l.png");
        this.cell.addChild(l)

        var t = PIXI.Sprite.fromImage("img/backgrounds/desert-t.png");
        this.cell.addChild(t)

        var b = PIXI.Sprite.fromImage("img/backgrounds/desert-b.png");
        //this.cell.addChild(b)
    }

    private onClick(e: Event) {
        dispatcher.dispatch(dispatcher.SELECT_BACKGROUND)
    }
}

export default new Background();