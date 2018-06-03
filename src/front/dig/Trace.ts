import User from "./User";
import dispatcher from "../dispatcher";
import { TweenLite } from "gsap";

class Trace extends PIXI.Container {

    private onUserMoved_fct:()=>void

    private oldx: number;
    private oldy: number;

    constructor() {
        super()

        this.onUserMoved_fct = this.onUserMoved.bind(this)
        dispatcher.on("dig_userMoved", this.onUserMoved_fct)

        this.filters = [new PIXI.filters.BlurFilter()]
    }

    private onUserMoved(x: number, y: number) {
        if (Math.abs(this.oldx-x) < 10 && Math.abs(this.oldy-y) < 10) {
            return;
        }

        this.oldx = x;
        this.oldy = y;

        let t = new PIXI.Graphics();
        /** @todo Use that for a special power */
        //t.beginFill(Math.random()*0xFFFFFF, .75)
        t.beginFill(0xDDDDEF, 1)
        t.drawCircle(x, y, 15)
        this.addChild(t);

        /** @todo use that for a weapon */
        //TweenLite.to(t, Math.random()+1, {alpha: 0, y: String(-Math.random()*30+30), onComplete: () => {
        //    this.removeChild(t)
        //}})
        TweenLite.to(t, 1.5, {alpha: 0, onComplete: () => {
            this.removeChild(t)
        }})
    }

    public kill() {
        dispatcher.off("dig_userMoved", this.onUserMoved_fct)
        this.parent.removeChild(this)
    }
}

export default Trace