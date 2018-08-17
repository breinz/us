import dispatcher from "../dispatcher";
import { TweenLite, Linear } from "gsap";
import Axios from "axios";
import { cell as main } from "../main";

type neighbor_type = { _id: string, ground: string }
type cell_type = { _id: string, neighbors: { top: neighbor_type, right: neighbor_type, left: neighbor_type, bottom: neighbor_type } }

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

        Axios.get("/api/map").then(res => {
            console.log(res.data.map.cells);
            this.build(res.data.map.cells)
        })
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



    private build(cells: cell_type[]): void {
        let cell: cell_type;
        for (let i = 0; i < cells.length; i++) {
            cell = cells[i];
            if (cell._id === main.user_data.currentCell) {
                console.log("found first cell");
            }
        }
    }
}

export default Map;