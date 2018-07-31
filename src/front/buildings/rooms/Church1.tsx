
import { TweenLite, Linear } from "gsap";
import { cell } from "../../main";

export default class Church1 extends PIXI.Container {

    private grid_data = "0,2,1,2,1,19,1,4,1,2,1,17,3,4,1,1,1,5,8,7,1,4,1,1,1,5,8,6,2,4,1,3,1,3,8,7,1,4,1,3,1,18,1,4,5,14,5,9,1,12,1,7,1,7,1,10,1,7,3,24,5,22,6,22,5,1,10,2,10,1,3,26,1,3,10,2,10,34,10,2,10,34,10,2,10,3,1,26,3,1,10,2,10,1,5,22,16,2,15,24,4,1,10,2,10,1,2,840"

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
        cell.grid.load(this.grid_data);

        cell.user.visible = true;
        cell.user.x = cell.app.view.width / 2;
        cell.user.y = cell.app.view.height - 1;
        cell.user.moveTo({
            x: cell.app.view.width / 2,
            y: cell.app.view.height - 50
        })
    }
}