import User from "./User";
import { cell } from "../main";
import Axios from "axios";

export default class Move {

    private user: User;

    private will_move: boolean = false
    private move_cursor: PIXI.Graphics;

    private _onMoveCursorMove: () => void;
    private _onStageMouseUp: () => void;
    private _move: () => void;

    private targets: number[][];

    private callback: () => void;

    private frame: number;

    constructor(user: User) {
        this.user = user;

        this._onMoveCursorMove = this.onMoveCursorMove.bind(this)
        this._onStageMouseUp = this.onStageMouseUp.bind(this)
        this._move = this.move.bind(this)

        this.move_cursor = new PIXI.Graphics()
        this.move_cursor.lineStyle(2, 0)
        this.move_cursor.drawCircle(0, 0, 10)
        this.move_cursor
            .moveTo(0, -10).lineTo(0, -2)
            .moveTo(0, 10).lineTo(0, 2)
            .moveTo(-10, 0).lineTo(-2, 0)
            .moveTo(10, 0).lineTo(2, 0)

        this.frame = 0;
    }

    /**
     * Show the cursor to move to a destination
     */
    public start(e: PIXI.interaction.InteractionEvent) {
        this.user.addChild(this.move_cursor)
        this.move_cursor.x = e.data.global.x - this.user.x;
        this.move_cursor.y = e.data.global.y - this.user.y;

        cell.app.ticker.remove(this._move)

        cell.app.view.setAttribute("style", "cursor:none")

        cell.app.stage.on("mousemove", this._onMoveCursorMove)
        cell.app.stage.on("mouseup", this._onStageMouseUp)
    }

    /**
     * Move to a destination
     * @param x x in pixels
     * @param y y in pixels
     */
    public to(x: number, y: number, callback?: () => void) {
        cell.app.ticker.remove(this._move)

        this.callback = callback;

        this.targets = cell.grid.findPath(this.user.x, this.user.y, x, y)
        this.targets.shift();

        this.frame = 0;
        cell.app.ticker.add(this._move)
    }

    private onMoveCursorMove(e: PIXI.interaction.InteractionEvent): void {
        this.move_cursor.x = e.data.global.x - this.user.x;
        this.move_cursor.y = e.data.global.y - this.user.y;
    }

    private onStageMouseUp(e: PIXI.interaction.InteractionEvent): void {
        cell.app.stage.off("mousemove", this._onMoveCursorMove)
        cell.app.stage.off("mouseup", this._onStageMouseUp)

        this.to(e.data.global.x, e.data.global.y)

        this.user.removeChild(this.move_cursor)

        cell.app.view.setAttribute("style", "cursor:default")
    }

    private move() {
        if (++this.frame % 10 === 0) {
            if (!cell.user_controller.usePA(1, true)) {
                return cell.app.ticker.remove(this._move)
            }
        }

        let speed = 1.5;

        let target = this.targets[0]

        // Get the angle between user and the next destination
        let angle = Math.atan2(target[1] - this.user.y, target[0] - this.user.x)

        // Slows down before reaching the end destination
        if (this.targets.length === 1) {
            if (Math.abs(target[0] - this.user.x) < 20 && Math.abs(target[1] - this.user.y) < 20) {
                speed = Math.max(Math.abs(target[0] - this.user.x), Math.abs(target[1] - this.user.y)) * 1.5 / 20;
            }
        }

        // Move the user
        this.user.x += Math.cos(angle) * speed
        this.user.y += Math.sin(angle) * speed

        // Reorganize the buildings to allow passing behind them
        for (let i = 0; i < cell.arBuildings.length; i++) {
            const building = cell.arBuildings[i];
            if (this.user.y < building.container.y + building.horizon) {
                if (building.front === false) {
                    building.container.parent.addChild(building.container)
                    building.front = true;
                    console.log(building.data.building.name, "front");
                }
            } else if (building.front === true) {
                building.container.parent.addChildAt(building.container, 0)
                building.front = false;
                console.log(building.data.building.name, "back");
            }
        }

        // Reaches the end destination
        if (Math.abs(target[0] - this.user.x) < 2 && Math.abs(target[1] - this.user.y) < 2) {
            this.targets.shift();
            if (this.targets.length === 0) {
                if (this.callback) {
                    this.callback()
                }
                cell.app.ticker.remove(this._move)

                Axios.post("/api/actions/move", {
                    x: Math.round(this.user.x),
                    y: Math.round(this.user.y)
                });
            }
        }
    }
}