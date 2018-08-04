import * as React from "react"
import dispatcher from "../dispatcher";
import PriestParams from "../params/pnj/PriestParams"
import IPnj from "./IPnj";
import UserSprite from "../user/UserSprite";
import Move from "./Move";

export default class Priest extends PIXI.Container implements IPnj {

    public params: React.ReactElement<"div">;

    private shape: UserSprite;

    private move: Move;

    constructor() {
        super();
        this.draw()
        this.x = (Math.random() * 5 + 18) * 20;
        this.y = (Math.random() * 4 + 1) * 20;

        this.move = new Move(this);

        this.wander()

        this.interactive = true;

        this.on("click", this.onClick.bind(this))

        this.params = <PriestParams pnj={this} />
    }

    private draw() {
        this.shape = new UserSprite("img/pnj/priest.png")
        /*const shape = new PIXI.Graphics();
        shape.beginFill(0xFF0000)
        shape.drawCircle(0, 0, 10)*/
        this.addChild(this.shape)
    }

    public animate(start: boolean, angle?: number) {
        if (start) {
            this.shape.start(angle);
        } else {
            this.shape.stop();
        }
    }

    private wander() {
        console.log("wander");
        setTimeout(() => {
            this.move.to((Math.random() * 14 + 7) * 20, (Math.random() * 6 + 1) * 20, this.wander.bind(this))
        }, Math.random() * 2000 + 2000);
    }

    private onClick() {
        dispatcher.dispatch(dispatcher.SELECT_ELEMENT, "pnj", "priest", this)
    }
}