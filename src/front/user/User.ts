import { cell } from "../main";
import Move from "./move";
import UserSprite from "./UserSprite";

export default class User extends PIXI.Container {

    /** invisible layer used as mouse hit area */
    private over: PIXI.Graphics;

    private move: Move;

    private pic: UserSprite;

    constructor() {
        super()

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

        this.x = cell.user_data.x;
        this.y = cell.user_data.y;

        this.over = new PIXI.Graphics();
        this.over.beginFill(0, 0)
        this.over.drawCircle(0, 0, 20)
        this.addChild(this.over)
        this.over.interactive = true
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