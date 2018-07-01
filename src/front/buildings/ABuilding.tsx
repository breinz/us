import IBuilding from "./IBuilding";
import { BuildingData } from "./BuildingFactory";
import dispatcher from "../dispatcher";
import { cell } from "../main";

class ABuilding implements IBuilding {

    /**
     * The layer where to draw the building
     */
    protected layer: PIXI.Container;

    /**
     * Data
     */
    public data: BuildingData;

    /**
     * The actual building as seen on stage
     */
    protected container: PIXI.Container

    /**
     * Params
     */
    public params: React.ReactElement<"div">

    constructor(data: BuildingData, layer: PIXI.Container) {
        this.data = data;
        this.layer = layer;

        this.drawBuilding(null)
    }

    public get entry(): { x: number, y: number } {
        return {
            x: this.container.x + Math.random() * this.container.width - this.container.width / 2,
            y: this.container.y + Math.random() * this.container.height - this.container.height / 2
        }
    }

    /**
     * Draw the building
     */
    protected drawBuilding(building: PIXI.DisplayObject): void {
        this.container = new PIXI.Container();
        this.container.addChild(building);

        this.container.x = this.data.x;
        this.container.y = this.data.y;

        this.container.interactive = true;
        this.container.on("click", this.onClick.bind(this))

        this.layer.addChild(this.container)

        cell.grid.addObstacle(this.container)
    }

    // **************************************************
    // Events
    // **************************************************

    /**
     * Click
     */
    private onClick(event: Event): void {
        dispatcher.dispatch(dispatcher.SELECT_BUILDING, this)
    }

}

export default ABuilding;