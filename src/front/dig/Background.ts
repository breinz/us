import dispatcher from "../dispatcher";

class Background extends PIXI.Container {

    private onUserMoved_fct:()=>void;

    //private light: PIXI.Sprite
    //private masq: PIXI.Graphics;

    constructor(rect:{width: number, height: number}) {
        super()

        var t = PIXI.Sprite.fromImage("img/backgrounds/dig.png");
        this.addChild(t)
        t.interactive = true;

        /*this.light = PIXI.Sprite.fromImage("img/backgrounds/gray.png");
        this.light.alpha = .3
        this.addChild(this.light)
        this.light.filters = [new PIXI.filters.BlurFilter()]

        this.masq = new PIXI.Graphics()
        this.masq.beginFill(0)
        this.masq.drawCircle(0, 0, 120)
        this.addChild(this.masq)
        this.light.mask = this.masq*/

        var b = new PIXI.Graphics()
        b.lineStyle(4, 0)
        b.drawRect(2, 2, rect.width-4, rect.height-4)
        this.addChild(b)

        /*this.onUserMoved_fct = this.onUserMoved.bind(this)

        dispatcher.on("dig_userMoved", this.onUserMoved_fct)
    }

    private onUserMoved(x: number, y: number) {
        this.masq.x = x;
        this.masq.y = y;

        this.light.alpha = Math.random()/20+.1*/
    }
}

export default Background