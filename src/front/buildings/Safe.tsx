import { BuildingData } from "../buildings/BuildingFactory";
import ABuilding from "./ABuilding";
import * as React from "react"
import SafeParams from "../params/buildings/SafeParams";

class Safe extends ABuilding {

    constructor(data: BuildingData, layer: PIXI.Container) {
        super(data, layer)

        this.params = <SafeParams building={this} />

        //cell.cell_socket.on("gotWater", this.updateRations.bind(this))

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

        let tmp = new PIXI.Graphics();
        tmp.beginFill(0xFFFF00).drawRect(0, 0, 32, 22)
        super.drawBuilding(tmp)

        /*let i = PIXI.Sprite.fromImage("img/buildings/well2.png")

        if (!i.texture.baseTexture.hasLoaded) {
            i.texture.baseTexture.once("loaded", () => {
                super.drawBuilding(i)
            })
        } else {
            super.drawBuilding(i)
        }*/
    }


}

export default Safe