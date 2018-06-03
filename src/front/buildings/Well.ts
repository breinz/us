import { BuildingData } from "../buildings/BuildingFactory";
import ABuilding from "./ABuilding";
import { cell } from "../main";

class Well extends ABuilding {


    constructor(data: BuildingData, layer: PIXI.Container) {
        super(data, layer)

        cell.cell_socket.on("gotWater", this.gotWater.bind(this))
    }

    /**
     * @inheritDoc
     */
    protected drawBuilding(): void {
        this.container = new PIXI.Container();
        
        let i = PIXI.Sprite.fromImage("img/buildings/well.png")
        i.anchor.set(.5, .5)
        this.container.addChild(i);

        super.drawBuilding()
    }

    /**
     * Someone took water from that well
     * @param data Data
     */
    private gotWater(data:{rations: number}) {
        this.data.rations = data.rations;
    }
}

export default Well