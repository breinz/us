import dispatcher from "../dispatcher";
import { TweenLite, Linear } from "gsap";
import Axios from "axios";
import { cell as main } from "../main";
import { GROUND } from "../../const";
import { MapType } from "../../types";


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



    private build(cells: MapType.Cell[]): void {
        let cell: MapType.Cell;
        for (let i = 0; i < cells.length; i++) {
            cell = cells[i];
            if (cell._id === main.user_data.currentCell) {
                this.drawCell(cell, 560 / 2, 560 / 2)
            }
        }
    }

    private drawCell(cell: MapType.Cell, x: number, y: number): void {
        const color_index = GROUND.LETTERS.indexOf(cell.ground);

        let c = new PIXI.Graphics();
        c.lineStyle(1).beginFill(GROUND.COLORS[color_index])
        c.drawRect(0, 0, 30, 30)
        c.x = x - 15;
        c.y = y - 15;
        this.addChild(c);
    }
}

export default Map;