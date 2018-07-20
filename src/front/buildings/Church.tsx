import * as React from "react"
import ABuilding from "./ABuilding";
import { BuildingData } from "./BuildingFactory";
import HatchParams from "../params/buildings/HatchParams";


class Church extends ABuilding {


    constructor(data: BuildingData, layer: PIXI.Container) {
        super(data, layer)

        this.params = null;//<HatchParams building={this} />;

        //cell.cell_socket.on("gotWater", this.updateRations.bind(this))
    }

    /**
     * @inheritDoc
     */
    protected drawBuilding(): void {

        let i = PIXI.Sprite.fromImage("img/buildings/church.png")
        i.anchor.set(.5, .5)

        if (!i.texture.baseTexture.hasLoaded) {
            i.texture.baseTexture.once("loaded", () => {
                super.drawBuilding(i)
            })
        } else {
            super.drawBuilding(i)
        }
    }

}

export default Church