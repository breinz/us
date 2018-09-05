import ABuilding from "./ABuilding";
import * as React from "react"
import SafeParams from "../params/buildings/SafeParams";
import { CellBuildingModel } from "../../back/cell/model";
import { ItemModel } from "../../back/item/model";
import messages from "../../SocketMessages";
import { cell } from "../main";
import { ITEMS } from "../../const";

export type SAFE_API = {
    OPEN: {
        success: boolean,
        item?: ItemModel,
        error?: string,
        fatal?: string
    }
};

//export const REFILL_DELAY: number = 1000 * 60 * 60 * 6;

class Safe extends ABuilding {


    private tmp: PIXI.Graphics;

    private open: boolean;

    constructor(data: CellBuildingModel/* BuildingData*/, layer: PIXI.Container) {
        super(data, layer)

        this.open = this.isOpen();

        this.params = <SafeParams building={this} />

        cell.cell_socket.on(messages.SAFE.OPEN.DOWN, this.opened.bind(this))

        this.offset = {
            x: 0,
            y: -5
        };

        this.horizon = 5;
    }

    /**
     * @inheritDoc
     */
    protected drawBuilding(): void {

        this.tmp = new PIXI.Graphics();
        this.tmp.beginFill(this.open ? 0xFF6600 : 0xFFFF00).drawRect(0, 0, 32, 22)
        super.drawBuilding(this.tmp)

        /*let i = PIXI.Sprite.fromImage("img/buildings/well2.png")

        if (!i.texture.baseTexture.hasLoaded) {
            i.texture.baseTexture.once("loaded", () => {
                super.drawBuilding(i)
            })
        } else {
            super.drawBuilding(i)
        }*/
    }

    protected opened(params: SAFE_API["OPEN"]) {
        this.tmp.clear().beginFill(0xFF6600).drawRect(0, 0, 32, 22)
    }

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

export default Safe