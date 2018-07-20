import * as React from "react"
import ABuilding from "./ABuilding";
import { BuildingData } from "./BuildingFactory";
import HatchParams from "../params/buildings/HatchParams";


class Hatch extends ABuilding {


    constructor(data: BuildingData, layer: PIXI.Container) {
        super(data, layer)

        this.params = <HatchParams building={this} />;//<WellParams building={this} />

        this.offset = { x: -10, y: 0 };

        //cell.cell_socket.on("gotWater", this.updateRations.bind(this))
    }

    /**
     * @inheritDoc
     */
    protected drawBuilding(): void {

        let i = PIXI.Sprite.fromImage("img/buildings/hatch.png")
        //i.anchor.set(.5, .5)

        if (!i.texture.baseTexture.hasLoaded) {
            i.texture.baseTexture.once("loaded", () => {
                super.drawBuilding(i)
            })
        } else {
            super.drawBuilding(i)
        }
    }

}

export default Hatch