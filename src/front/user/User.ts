import { cell } from "../main";
import Move from "./move";
import UserSprite from "./UserSprite";

export default class User extends PIXI.Container {

    /** invisible layer used as mouse hit area */
    private over: PIXI.Graphics;

    private move: Move;

    private pic: UserSprite;

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
        this.pic = new UserSprite("img/boy1.png");
        this.addChild(this.pic)

        /*let i = PIXI.Sprite.fromImage("img/boy1.png")
        i.anchor.set(.5, .5);
        this.addChild(i);*/

        /*let s = new PIXI.Graphics()
        s.beginFill(0)
        s.drawCircle(0, 0, 7)
        this.addChild(s)*/

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

    /**
     * Animate the user
     * @param begin Start or stop the animation
     * @param angle Angle in radians
     */
    public animate(begin: boolean, angle?: number) {

        if (begin) {
            this.pic.start(angle)
        } else {
            this.pic.stop();
        }
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