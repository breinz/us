import dispatcher from "../dispatcher";
import { TweenLite, Linear } from "gsap";

class Map extends PIXI.Container {

    private container: PIXI.Container;

    constructor() {
        super()

        this.container = new PIXI.Container()

        this.create()

        dispatcher.on(dispatcher.SHOW_MAP, this.show.bind(this))
        dispatcher.on(dispatcher.HIDE_MAP, this.hide.bind(this))
    }

    /**
     * Show map
     */
    private show(): void {
        this.addChild(this.container)

        this.container.alpha = 1;

        TweenLite.from(this.container, .5, { alpha: 0, ease: Linear.easeIn })
    }

    /**
     * Hide map
     */
    private hide(): void {
        TweenLite.to(this.container, .5, {
            alpha: 0,
            ease: Linear.easeIn,
            onComplete: () => {
                this.removeChild(this.container)
            }
        })
    }

    /**
     * Create the map
     */
    private create(): void {
        // --------------------------------------------------
        // Background
        // --------------------------------------------------
        const background = PIXI.Sprite.fromImage("img/backgrounds/dig.png");
        this.container.addChild(background)
        background.interactive = true;
    }
}

export default Map;