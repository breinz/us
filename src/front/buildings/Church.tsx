import * as React from "react"
import ABuilding from "./ABuilding";
import { BuildingData } from "./BuildingFactory";
import HatchParams from "../params/buildings/HatchParams";
import ChurchParams from "../params/buildings/ChurchParams";


class Church extends ABuilding {



    constructor(data: BuildingData, layer: PIXI.Container) {
        super(data, layer)

        this.params = <ChurchParams building={this} />;

        this.offset = {
            x: 0,
            y: -13
        }

        this.horizon = 140;

        //cell.cell_socket.on("gotWater", this.updateRations.bind(this))
    }

    /**
     * @inheritDoc
     */
    protected drawBuilding(): void {

        let i = PIXI.Sprite.fromImage("img/buildings/church.png")
        //i.anchor.set(.5, .5)

        if (!i.texture.baseTexture.hasLoaded) {
            i.texture.baseTexture.once("loaded", () => {
                super.drawBuilding(i)
            })
        } else {
            super.drawBuilding(i)
        }

        console.log("set horizon");
    }

    public get entry() {
        return {
            x: this.container.x + 155,
            y: this.container.y + this.container.height - 90
        }
    }

}

export default Church