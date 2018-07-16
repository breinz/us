import { BuildingData } from "../buildings/BuildingFactory";
import ABuilding from "./ABuilding";
import { cell } from "../main";
import * as React from "react"
import WellParams from "../params/buildings/WellParams";

class Well extends ABuilding {


    constructor(data: BuildingData, layer: PIXI.Container) {
        super(data, layer)

        this.params = <WellParams building={this} />

        cell.cell_socket.on("gotWater", this.updateRations.bind(this))
        cell.cell_socket.on("addedWater", this.updateRations.bind(this))
        cell.cell_socket.on("well.poisoned", this.updatePoison.bind(this))
    }

    /**
     * @inheritDoc
     */
    protected drawBuilding(): void {

        let i = PIXI.Sprite.fromImage("img/buildings/well2.png")
        i.anchor.set(.5, .5)

        if (!i.texture.baseTexture.hasLoaded) {
            i.texture.baseTexture.once("loaded", () => {
                super.drawBuilding(i)
            })
        } else {
            super.drawBuilding(i)
        }
    }

    /**
     * Someone took water from that well
     * @param data Data
     */
    private updateRations(data: { rations: number }) {
        this.data.rations = data.rations;
    }

    /**
     * Someone poisoned the well
     * @param data Data
     */
    private updatePoison(data: { poison: number }) {
        this.data.poison = data.poison;
    }
}

export default Well