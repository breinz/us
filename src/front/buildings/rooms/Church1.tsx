
import { TweenLite, Linear } from "gsap";
import { cell } from "../../main";

export default class Church1 extends PIXI.Container {

    constructor() {
        super()

        // Background
        const background = PIXI.Sprite.fromImage("img/backgrounds/church1.png");
        this.addChild(background)
        background.interactive = true;

        TweenLite.from(this, .5, { alpha: 0, ease: Linear.easeIn, onComplete: () => { this.start() } })
    }

    /**
     * Starts the level
     */
    private start() {
        cell.user.visible = true;
        cell.user.x = cell.app.view.width / 2;
        cell.user.y = cell.app.view.height - 1;
        cell.user.moveTo({
            x: cell.app.view.width / 2,
            y: cell.app.view.height - 50
        })
    }
}