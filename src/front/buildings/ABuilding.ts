import IBuilding from "./IBuilding";
import { BuildingData } from "./BuildingFactory";
import dispatcher from "../dispatcher";

class ABuilding implements IBuilding {
    
    /**
     * The layer where to draw the building
     */
    protected layer: PIXI.Container;

    /**
     * Data
     */
    protected data: BuildingData;

    /**
     * The actual building as seen on stage
     */
    protected container: PIXI.Container

    constructor(data: BuildingData, layer: PIXI.Container) {
        this.data = data;
        this.layer = layer;
        
        this.drawBuilding()
    }

    /**
     * Draw the building
     */
    protected drawBuilding(): void {
        this.container.x = this.data.x;
        this.container.y = this.data.y;

        this.container.interactive = true;
        this.container.on("click", this.onClick.bind(this))

        this.layer.addChild(this.container)
    }

    // **************************************************
    // Events
    // **************************************************

    /**
     * Click
     */
    private onClick(event: Event): void {
        dispatcher.dispatch("selectBuilding", this.data)
    }
    
}

export default ABuilding;