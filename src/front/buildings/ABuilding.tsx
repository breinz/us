import IBuilding from "./IBuilding";
import dispatcher from "../dispatcher";
import { cell } from "../main";
import Mode from "../mode";
import { CellBuildingModel } from "../../back/cell/model";

class ABuilding implements IBuilding {

    /** DEV */
    private dev_hitArea: PIXI.Graphics[] = []

    /**
     * The layer where to draw the building
     */
    protected layer: PIXI.Container;

    /**
     * Data
     */
    public data: CellBuildingModel/* BuildingData*/;

    /**
     * The actual building as seen on stage
     */
    public container: PIXI.Container

    private hitArea: PIXI.Polygon;

    /**
     * Horizontal limit where the user goes behind the building
     */
    public horizon: number = 0;
    private dev_horizon_line: PIXI.Graphics;

    private onClick_fct: () => void;


    /**
     * Buildings are placed by multiples of 20, offset is here to finely place it.
     */
    protected offset: { x: number, y: number };

    /**
     * If the building is in front of the user
     */
    public front: boolean = undefined;

    /**
     * Params
     */
    public params: React.ReactElement<"div">

    constructor(data: CellBuildingModel/* BuildingData*/, layer: PIXI.Container) {
        this.data = data;
        this.layer = layer;

        this.onClick_fct = this.onClick.bind(this);

        this.offset = { x: 0, y: 0 };

        setTimeout(() => {
            this.drawBuilding(null)
        }, 1);

        dispatcher.on(dispatcher.DEV_SHOW_HIT_AREA, this.onShowHitArea.bind(this));
    }

    private onShowHitArea() {
        for (let i = 0; i < this.dev_hitArea.length; i++) {
            this.dev_hitArea[i].visible = !this.dev_hitArea[i].visible;
        }
        this.dev_horizon_line.visible = !this.dev_horizon_line.visible;
    }

    public get entry(): { x: number, y: number } {
        return {
            x: this.container.x + Math.random() * this.container.width,
            y: this.container.y + this.container.height
        }
    }

    /**
     * Draw the building
     */
    protected drawBuilding(building: PIXI.DisplayObject): void {
        this.container = new PIXI.Container();
        this.container.addChild(building);

        console.log(this.data.building.name, this.offset);
        this.container.x = this.data.x + this.offset.x;
        this.container.y = this.data.y + this.offset.y;

        this.layer.addChild(this.container)

        let points: PIXI.Point[] = [];
        let tmpPoints: PIXI.Point[] = []
        let arHit = this.data.building.hitArea.split(",")
        for (let i = 0; i < arHit.length; i += 2) {
            points.push(new PIXI.Point(parseInt(arHit[i]), parseInt(arHit[i + 1])));
            tmpPoints.push(new PIXI.Point(
                this.container.x + parseInt(arHit[i]),
                this.container.y + parseInt(arHit[i + 1])));
        }

        this.hitArea = new PIXI.Polygon(points)

        // --------------------------------------------------
        // Dev
        let ha = new PIXI.Graphics();
        ha.beginFill(0xFF00FF, .5)
        ha.drawPolygon(tmpPoints)

        this.layer.addChild(ha)

        ha.visible = false;
        this.dev_hitArea.push(ha)
        // --------------------------------------------------

        this.container.hitArea = this.hitArea;

        cell.grid.addObstacle(this.container, this.offset, this.data.building.obstacle)

        cell.arBuildings.push(this);

        dispatcher.on(dispatcher.SWITCH_MODE, this.onSwitchMode.bind(this))

        this.onSwitchMode(cell.user_data.mode)

        this.drawHorizon()

        dispatcher.dispatch(dispatcher.BUILDING_LOADED)
    }

    private drawHorizon() {
        this.dev_horizon_line = new PIXI.Graphics()
        this.dev_horizon_line.lineStyle(2, 0xFF0000)
        this.dev_horizon_line.moveTo(-50, this.horizon).lineTo(this.container.width + 50, this.horizon)
        this.container.addChild(this.dev_horizon_line);
        this.dev_horizon_line.visible = false;
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
        dispatcher.dispatch(dispatcher.SELECT_ELEMENT, "building", this.data.building.name, this)
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