import IBuilding from "./IBuilding";
import { BuildingData } from "./BuildingFactory";
import dispatcher from "../dispatcher";
import { cell } from "../main";
import Mode from "../mode";

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

    private onClick_fct: () => void;

    /**
     * Params
     */
    public params: React.ReactElement<"div">

    constructor(data: BuildingData, layer: PIXI.Container) {
        this.data = data;
        this.layer = layer;

        this.onClick_fct = this.onClick.bind(this);

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

        this.layer.addChild(this.container)

        cell.grid.addObstacle(this.container)

        dispatcher.on(dispatcher.SWITCH_MODE, this.onSwitchMode.bind(this))

        this.onSwitchMode(cell.user_data.mode)
    }

    // **************************************************
    // Events
    // **************************************************

    /**
     * Click
     */
    private onClick(event: Event): void {
        // Fight mode, don't select buildings
        if (cell.user_controller.state.mode === 1) {
            return
        }
        dispatcher.dispatch(dispatcher.SELECT_BUILDING, this)
    }

    /**
     * Switch mode
     * @param mode Which mode we're entering 
     */
    private onSwitchMode(mode: number) {
        if (mode === Mode.EXPLORATION) {
            this.container.interactive = true;
            this.container.on("click", this.onClick_fct)
        } else {
            this.container.interactive = false;
            this.container.off("click", this.onClick_fct)
        }
    }

}

export default ABuilding;