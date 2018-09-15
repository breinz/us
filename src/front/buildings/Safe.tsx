import ABuilding from "./ABuilding";
import * as React from "react"
import SafeParams from "../params/buildings/SafeParams";
import { CellBuildingModel } from "../../back/cell/model";
import messages from "../../SocketMessages";
import { cell } from "../main";
import { ITEMS } from "../../const";
import { Us } from "../../us";
import Item from "../cell/Item";
import { TweenLite, Linear, Quint, Bounce } from "gsap";


export default class Safe extends ABuilding {

    // --------------------------------------------------
    // API Messages
    //public static OPEN: string = "safe_open";
    //public static OPENED: string = "safe_opened";

    private refill_timer: NodeJS.Timer;

    private tmp: PIXI.Graphics;

    constructor(data: CellBuildingModel/* BuildingData*/, layer: PIXI.Container) {

        super(data, layer)


        this.params = <SafeParams building={this} />


        this.offset = {
            x: 0,
            y: -5
        };

        this.horizon = 5;

        cell.cell_socket.on(messages.Safe.OPENED, (data: Us.Safe.ApiResult.Open) => { this.opened(data) })
        cell.cell_socket.on(messages.Safe.REFILLED, () => { this.refilled() })
    }

    /*public get entry(): { x: number, y: number } {
        return {
            x: this.container.x + this.container.width / 2,
            y: this.container.y
        }
    }*/

    /**
     * @inheritDoc
     */
    protected drawBuilding(): void {

        const open = this.isOpen();

        this.tmp = new PIXI.Graphics();
        this.tmp.beginFill(open ? 0xFF6600 : 0xFFFF00).drawRect(0, 0, 32, 22)
        super.drawBuilding(this.tmp)

        if (open) {
            let at = new Date(this.data.visited[this.data.visited.length - 1].at);

            this.refill_timer = setTimeout(() => {
                this.refilled()
            }, at.getTime() + ITEMS.SAFE.REFILL_DELAY - Date.now());
        }

        /*let i = PIXI.Sprite.fromImage("img/buildings/well2.png")

        if (!i.texture.baseTexture.hasLoaded) {
            i.texture.baseTexture.once("loaded", () => {
                super.drawBuilding(i)
            })
        } else {
            super.drawBuilding(i)
        }*/
    }

    protected opened(data: Us.Safe.ApiResult.Open) {
        // Draw the open safe
        this.tmp.clear().beginFill(0xFF6600).drawRect(0, 0, 32, 22)

        // Save data
        this.data.visited.push({ at: data.now });

        // Restart the timer
        clearTimeout(this.refill_timer);

        const at = new Date(data.now);

        //Date.now() - at.getTime()


        this.refill_timer = setTimeout(() => {
            this.refill()
        }, at.getTime() + ITEMS.SAFE.REFILL_DELAY - Date.now());

        // Add the item
        const container = new PIXI.Container();
        cell.game.addChild(container);
        container.x = this.data.x + this.container.width / 2
        container.y = this.data.y;

        let item: Item = new Item(data.cellItem);
        container.addChild(item);

        TweenLite.to(container, 1.3, {
            x: data.cellItem.x,
            y: data.cellItem.y,
            ease: Linear.easeOut
        });
        TweenLite.to(item, .3, {
            y: item.x - 30,
            ease: Quint.easeOut,
            onComplete: () => {
                TweenLite.to(item, 1, {
                    y: item.x,
                    ease: Bounce.easeOut
                })
            }
        })
    }

    // --------------------------------------------------
    // REFILL
    // --------------------------------------------------

    private refill() {
        cell.cell_socket.emit(messages.Safe.REFILL, this.data._id)
    }

    private refilled() {
        this.tmp.clear()
        this.tmp.beginFill(0xFFFF00).drawRect(0, 0, 32, 22)
    }

    /**
     * Only to initialize this.open
     */
    private isOpen(): boolean {
        if (!this.data.visited) {
            return false;
        }
        if (this.data.visited.length === 0) {
            return false;
        }
        const visited = this.data.visited;
        const at = visited[visited.length - 1].at;
        if (new Date(at) > new Date(Date.now() - ITEMS.SAFE.REFILL_DELAY)) {
            return true;
        }
        return false;
    }


}

//export default Safe