import dispatcher from "../dispatcher";

class Background {

    private container: PIXI.Container;

    public init(app: PIXI.Application) {

        this.container = new PIXI.Container();
        app.stage.addChild(this.container);

        this.container.interactive = true;
        this.container.on("click", this.onClick);

        //var t = PIXI.extras.TilingSprite.from("img/backgrounds/grass.jpg", 560, 560);
        var t = PIXI.Sprite.fromImage("img/backgrounds/grass.png");
        this.container.addChild(t)

        var r = PIXI.Sprite.fromImage("img/backgrounds/snow-r.png");
        //this.container.addChild(r)

        var l = PIXI.Sprite.fromImage("img/backgrounds/water-l.png");
        //this.container.addChild(l)

        var t = PIXI.Sprite.fromImage("img/backgrounds/water-t.png");
        this.container.addChild(t)

        var b = PIXI.Sprite.fromImage("img/backgrounds/desert-b.png");
        //this.container.addChild(b)
    }

    private onClick(e: Event) {
        dispatcher.dispatch(dispatcher.SELECT_BACKGROUND)
    }
}

export default new Background();