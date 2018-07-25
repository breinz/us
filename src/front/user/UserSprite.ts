import { cell } from "../main";
import { R2D } from "../../helper";

export default class UserSprite extends PIXI.Sprite {

    private animation: string;

    private tick_fct: () => void;

    private frame: number;
    private speed: number;

    constructor(url: string) {
        super()

        this.tick_fct = this.tick.bind(this);

        this.texture = PIXI.Texture.fromImage(url);

        if (!this.texture.baseTexture.hasLoaded) {
            this.texture.baseTexture.once("loaded", this.draw.bind(this))
        } else {
            this.draw()
        }
    }

    public start(angle: number) {
        angle = R2D * angle;

        if (angle > 337.5) this.animation = "right";
        else if (angle > 0 && angle < 22.5) this.animation = "right";
        else if (angle > 22.5 && angle < 67.5) this.animation = "bottom_right";
        else if (angle > 67.5 && angle < 112.5) this.animation = "bottom";
        else if (angle > 112.5 && angle < 157.5) this.animation = "bottom_left";
        else if (angle > 157.5 && angle < 202.5) this.animation = "left";
        else if (angle > 202.5 && angle < 247.5) this.animation = "top_left";
        else if (angle > 247.5 && angle < 292.5) this.animation = "top";
        else if (angle > 292.5 && angle < 337.5) this.animation = "top_right";

        else if (angle < -337.5) this.animation = "right";
        else if (angle > -22.5 && angle < 0) this.animation = "right";
        else if (angle > -67.5 && angle < -22.5) this.animation = "top_right";
        else if (angle > -112.5 && angle < -67.5) this.animation = "top";
        else if (angle > -157.5 && angle < -112.5) this.animation = "top_left";
        else if (angle > -202.5 && angle < -157.5) this.animation = "left";
        else if (angle > -257.5 && angle < -202.5) this.animation = "bottom_left";
        else if (angle > -292.5 && angle < -257.5) this.animation = "bottom";
        else if (angle > -337.5 && angle < -292.5) this.animation = "bottom_right";

        //if (angle > 315) this.animation = "right"
        //else if (angle > 0 && angle < 45) this.animation = "right"
        //else if (angle > 45 && angle < 135) this.animation = "bottom"
        //else if (angle > 135 && angle < 225) this.animation = "left"
        //else if (angle > 225 && angle < 315) this.animation = "top"
        //
        //else if (angle < -315) this.animation = "right"
        //else if (angle < 0 && angle > -45) this.animation = "right"
        //else if (angle < -45 && angle > -135) this.animation = "top"
        //else if (angle < -135 && angle > -225) this.animation = "left"
        //else if (angle < -225 && angle > -315) this.animation = "bottom"



        this.frame = 1;
        this.speed = 0;

        cell.app.ticker.add(this.tick_fct)
    }

    public stop() {
        //this.texture.frame = new PIXI.Rectangle(0, 0, 25, 25);
        cell.app.ticker.remove(this.tick_fct)
    }

    private tick() {

        if (this.animation === "bottom") {
            if (this.speed++ % 8 !== 0) return;
            this.texture.frame = new PIXI.Rectangle(this.frame * 25, 0, 25, 25);
            if (++this.frame % 3 === 0) {
                this.frame = 1;
            }
        }
        if (this.animation === "top") {
            if (this.speed++ % 8 !== 0) return;
            this.texture.frame = new PIXI.Rectangle(this.frame * 25, 25, 25, 25);
            if (++this.frame % 3 === 0) {
                this.frame = 1;
            }
        }
        if (this.animation === "right") {
            if (this.speed++ % 6 !== 0) return;
            this.texture.frame = new PIXI.Rectangle(this.frame * 25, 50, 25, 25);
            if (++this.frame % 4 === 0) {
                this.frame = 1;
            }
        }
        if (this.animation === "left") {
            if (this.speed++ % 6 !== 0) return;
            this.texture.frame = new PIXI.Rectangle(this.frame * 25, 75, 25, 25);
            if (++this.frame % 4 === 0) {
                this.frame = 1;
            }
        }
        if (this.animation === "bottom_right") {
            if (this.speed++ % 6 !== 0) return;
            this.texture.frame = new PIXI.Rectangle(this.frame * 25, 100, 25, 25);
            if (++this.frame % 3 === 0) {
                this.frame = 1;
            }
        }
        if (this.animation === "bottom_left") {
            if (this.speed++ % 6 !== 0) return;
            this.texture.frame = new PIXI.Rectangle(this.frame * 25, 125, 25, 25);
            if (++this.frame % 3 === 0) {
                this.frame = 1;
            }
        }
        if (this.animation === "top_right") {
            if (this.speed++ % 6 !== 0) return;
            this.texture.frame = new PIXI.Rectangle(this.frame * 25, 150, 25, 25);
            if (++this.frame % 3 === 0) {
                this.frame = 1;
            }
        }
        if (this.animation === "top_left") {
            if (this.speed++ % 6 !== 0) return;
            this.texture.frame = new PIXI.Rectangle(this.frame * 25, 175, 25, 25);
            if (++this.frame % 3 === 0) {
                this.frame = 1;
            }
        }
    }

    private draw() {
        this.texture.frame = new PIXI.Rectangle(0, 0, 25, 25)

        this.anchor.set(.5, .5)
    }


}