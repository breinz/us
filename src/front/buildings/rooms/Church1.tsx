
import { TweenLite, Linear } from "gsap";

export default class Church1 extends PIXI.Container {

    constructor() {
        super()

        // Background
        const background = PIXI.Sprite.fromImage("img/backgrounds/church1.png");
        this.addChild(background)
        background.interactive = true;

        TweenLite.from(this, .5, { alpha: 0, ease: Linear.easeIn })
    }
}