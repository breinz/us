import { BuildingData } from "../buildings/BuildingFactory";
import IBuilding from "./IBuilding";
import ABuilding from "./ABuilding";
import IAction from "../actions/IAction";
import axios from "axios";

class Weel extends ABuilding {

    /**
     * The UI for the action `getWater`
     */
    private getWater_btn:PIXI.Container;

    /**
     * Function to call on action `getWater`
     * Binded with this
     */
    private getWater_fct:Function;

    constructor(data:BuildingData, layer:PIXI.Container) {
        super(data, layer)
    }

    /**
     * @inheritDoc
     */
    protected drawBuilding(): void {
        this.container = new PIXI.Container();
        

        let s = new PIXI.Graphics();
        s.beginFill(0x343258)
        s.drawCircle(0, 0, 12)
        this.container.addChild(s)

        super.drawBuilding()
    }

    /**
     * @inheritDoc
     */
    protected get actions():IAction[] {
        // if has_water add action dropWater
        return [
            {
                title: "get_water",
                fct: this.getWater_fct,
                shape: this.getWater_btn
            }
        ]
    }

    /**
     * Action get water
     */
    private getWater(): void {
        axios.post("/api/actions/getWater", {
            weelId: this.data._id
        }).then(res => {
            console.log(res.data);
        }).catch(err => {
            console.error(err);
        })
    }

    /**
     * Prepare the different available actions by setting the UI and fct
     */
    protected prepareActions(): void {
        // --------------------------------------------------
        // getWater

        // Fct
        this.getWater_fct = this.getWater.bind(this)

        // Btn
        this.getWater_btn = new PIXI.Container();
        let g = new PIXI.Graphics();
        g.lineStyle(1, 0)
        g.beginFill(0xCCCCFF)
        g.drawCircle(0, 0, 15)
        this.getWater_btn.addChild(g)
    }
}

export default Weel