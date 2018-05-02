import { BuildingData } from "../buildings/BuildingFactory";
import ABuilding from "./ABuilding";
import IAction from "../actions/IAction";


class Home extends ABuilding {

    private test_btn: PIXI.Container;
    private test_fct: Function;
    private enter_btn:PIXI.Container;
    private enter_fct:Function;

    constructor(data:BuildingData, layer:PIXI.Container) {
        super(data, layer)
    }

    /**
     * @inheritDoc
     */
    protected drawBuilding(): void {
        this.container = new PIXI.Container()
        this.layer.addChild(this.container)

        let s = new PIXI.Graphics();
        s.beginFill(0x662115)
        s.drawRect(-25, -25, 50, 50)
        this.container.addChild(s)

        super.drawBuilding();
    }

    /**
     * @inheritDoc
     */
    protected prepareActions(): void {
        let g:PIXI.Graphics;
        // --------------------------------------------------
        // Test

        // btn
        this.test_btn = new PIXI.Container();
        g = new PIXI.Graphics();
        g.lineStyle(1, 0)
        g.beginFill(0xFFCCCC)
        g.drawCircle(0, 0, 15)
        this.test_btn.addChild(g)

        // callback
        this.test_fct = this.onTest.bind(this)

        // --------------------------------------------------
        // Enter

        // btn
        this.enter_btn = new PIXI.Container();
        g = new PIXI.Graphics();
        g.lineStyle(1, 0)
        g.beginFill(0xCCFFCC)
        g.drawCircle(0, 0, 15)
        this.enter_btn.addChild(g)

        // Callback
        this.enter_fct = this.onEnter.bind(this)
    }

    /**
     * @inheritDoc
     */
    protected get actions():IAction[] {
        // if has_water add action dropWater
        return [
            {
                title: "enter",
                fct: this.enter_fct,
                shape: this.enter_btn
            },{
                title: "enter",
                fct: this.test_fct,
                shape: this.test_btn
            },
        ]
    }

    private onEnter() {
        console.log("ENTER !!!");
    }

    private onTest() {
        console.log("TEST !!!");    
    }
}

export default Home