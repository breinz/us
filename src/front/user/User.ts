import { cell } from "../main";
import Move from "./move";

export default class User extends PIXI.Container {

    /** invisible layer used as mouse hit area */
    private over: PIXI.Graphics;

    private move: Move;

    private _onStageMouseMove: () => void;
    private _onStageMouseUp: () => void;

    constructor() {
        super()

        this._onStageMouseMove = this.onStageMouseMove.bind(this)
        this._onStageMouseUp = this.onStageMouseUp.bind(this)

        this.draw()
    }

    public init() {
        this.move = new Move(this);
    }

    public moveTo(dest: { x: number, y: number }, callback?: () => void) {
        this.move.to(dest.x, dest.y, callback)
    }

    private draw() {
        let s = new PIXI.Graphics()
        s.beginFill(0)
        s.drawCircle(0, 0, 7)
        this.addChild(s)

        this.x = cell.user_data.x;
        this.y = cell.user_data.y;

        this.over = new PIXI.Graphics();
        this.over.beginFill(0, 0)
        this.over.drawCircle(0, 0, 20)
        this.addChild(this.over)
        this.over.interactive = true
        this.over.on("mouseover", this.onMouseOver.bind(this))
        this.over.on("mousedown", this.onMouseDown.bind(this))
    }

    private onMouseOver(): void {

    }

    private onMouseDown(): void {
        cell.app.stage.on("mousemove", this._onStageMouseMove)
        cell.app.stage.on("mouseup", this._onStageMouseUp)
    }

    private onStageMouseMove(e: PIXI.interaction.InteractionEvent): void {
        cell.app.stage.off("mousemove", this._onStageMouseMove)
        cell.app.stage.off("mouseup", this._onStageMouseUp)

        this.move.start(e)
    }

    private onStageMouseUp(): void {
        cell.app.stage.off("mousemove", this._onStageMouseMove)
        cell.app.stage.off("mouseup", this._onStageMouseUp)
    }

}