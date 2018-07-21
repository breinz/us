import { BuildingData } from "../buildings/BuildingFactory";
import ABuilding from "./ABuilding";
import HouseParams from "../params/buildings/HouseParams";
import * as React from 'react'


class Home extends ABuilding {

    constructor(data: BuildingData, layer: PIXI.Container) {
        super(data, layer)

        this.offset = {
            x: 5,
            y: 0
        }

        this.horizon = 23;

        this.params = <HouseParams data={data} building={this} />
    }

    public get entry() {
        return {
            x: this.container.x + this.container.width / 2,
            y: this.container.y + this.container.height - 10
        }
    }

    /**
     * @inheritDoc
     */
    protected drawBuilding(): void {

        let i = PIXI.Sprite.fromImage("img/buildings/house2.png")

        if (!i.texture.baseTexture.hasLoaded) {
            i.texture.baseTexture.once("loaded", () => {
                super.drawBuilding(i);
            })
        } else {
            super.drawBuilding(i);
        }

    }
}

export default Home