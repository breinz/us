import { BuildingData } from "../buildings/BuildingFactory";
import ABuilding from "./ABuilding";


class Home extends ABuilding {

    constructor(data: BuildingData, layer: PIXI.Container) {
        super(data, layer)
    }

    /**
     * @inheritDoc
     */
    protected drawBuilding(): void {
        this.container = new PIXI.Container()
        this.layer.addChild(this.container)

        let i = PIXI.Sprite.fromImage("img/buildings/house.png")
        i.anchor.set(.5, .5)
        this.container.addChild(i);

        super.drawBuilding();
    }
}

export default Home