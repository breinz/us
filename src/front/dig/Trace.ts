import dispatcher from "../dispatcher";
import { TweenLite } from "gsap";

export default class Trace extends PIXI.Container {

    private onUserMoved_fct: () => void

    private oldx: number;
    private oldy: number;

    private texture: PIXI.Texture;

    constructor() {
        super()

        this.onUserMoved_fct = this.onUserMoved.bind(this)
        dispatcher.on(dispatcher.DIG_USER_MOVED, this.onUserMoved_fct)

        this.filters = [new PIXI.filters.BlurFilter()]

        var t = new PIXI.Graphics();
        t.beginFill(0xDDDDEF, 1)
        t.drawCircle(0, 0, 15)
        t.cacheAsBitmap = true;
        this.texture = t.generateCanvasTexture()
    }

    private onUserMoved(x: number, y: number) {
        if (Math.abs(this.oldx - x) < 10 && Math.abs(this.oldy - y) < 10) {
            return;
        }

        this.oldx = x;
        this.oldy = y;

        let s = new PIXI.Sprite(this.texture);
        (s as any)["countInDebug"] = false
        s.x = x - 15;
        s.y = y - 15;
        this.addChild(s)

        TweenLite.to(s, 1.5, {
            alpha: 0, onComplete: () => {
                s.destroy()
                this.removeChild(s)
            }
        })
    }
}