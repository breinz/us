import { cell } from "../main";
import Move from "./move";
import UserSprite from "./UserSprite";

export default class User extends PIXI.Container {

    private move: Move;

    private pic: UserSprite;

    constructor() {
        super()

        this.draw()
    }

    public init() {
        this.move = new Move(this);
    }

    /**
     * Move to a destination
     * @param dest Destination
     * @param callback Callback
     */
    public moveTo(dest: { x: number, y: number }, callback?: () => void) {
        this.move.to(dest.x, dest.y, callback)
    }

    private draw() {
        /*let base = new PIXI.Graphics();
        base.lineStyle(2, 0xFF0000, .6).beginFill(0xFF0000, .2);
        base.drawEllipse(0, 11, 16, 6);
        this.addChild(base);*/

        this.pic = new UserSprite("img/boy1.png");
        this.addChild(this.pic)

        this.x = cell.user_data.x;
        this.y = cell.user_data.y;
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

}