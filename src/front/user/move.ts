import User from "./User";
import { cell } from "../main";
import Axios from "axios";
import dispatcher from "../dispatcher";

export default class Move {

    private user: User;

    private v2_cursorVisible: boolean = false;
    private v2_mouseMove: (e: PIXI.interaction.InteractionEvent) => void
    private v2_mouseUp: () => void;

    private THRESHOLD: number = 10;
    private move_threshold: { x: number, y: number };

    private move_cursor: PIXI.Graphics;

    private _move: () => void;

    private targets: number[][];

    private callback: () => void;

    private frame: number;

    constructor(user: User) {
        this.user = user;

        this._move = this.move.bind(this)

        this.v2_mouseMove = this.onMouseMove.bind(this);
        this.v2_mouseUp = this.onMouseUp.bind(this);

        this.move_cursor = new PIXI.Graphics()
        this.move_cursor.lineStyle(2, 0)
        this.move_cursor.drawCircle(0, 0, 10)
        this.move_cursor
            .moveTo(0, -10).lineTo(0, -2)
            .moveTo(0, 10).lineTo(0, 2)
            .moveTo(-10, 0).lineTo(-2, 0)
            .moveTo(10, 0).lineTo(2, 0)

        this.frame = 0;

        dispatcher.on(dispatcher.BUILDING_LOADED, this.reorganizeBuildings.bind(this));

        cell.app.stage.on("mousedown", this.onMouseDown.bind(this));
    }

    /**
     * Mouse down
     * @param e MouseEvent
     */
    private onMouseDown(e: PIXI.interaction.InteractionEvent) {
        this.move_threshold = { x: e.data.global.x, y: e.data.global.y };

        this.v2_cursorVisible = false;

        cell.app.stage.on("mousemove", this.v2_mouseMove)
        cell.app.stage.on("mouseup", this.v2_mouseUp);
    }

    /**
     * Mouse move
     * @param e MouseEvent
     */
    private onMouseMove(e: PIXI.interaction.InteractionEvent) {
        if (this.v2_cursorVisible) {
            this.move_cursor.x = e.data.global.x;
            this.move_cursor.y = e.data.global.y;
        } else {
            if (
                Math.abs(e.data.global.x - this.move_threshold.x) > this.THRESHOLD ||
                Math.abs(e.data.global.y - this.move_threshold.y) > this.THRESHOLD
            ) {
                this.v2_cursorVisible = true;

                cell.app.stage.addChild(this.move_cursor);
                cell.app.view.setAttribute("style", "cursor:none");
                this.move_cursor.x = e.data.global.x;
                this.move_cursor.y = e.data.global.y;
            }
        }
    }

    /**
     * Mouse up
     * @param e MouseEvent
     */
    private onMouseUp(e: PIXI.interaction.InteractionEvent) {
        cell.app.stage.off("mousemove", this.v2_mouseMove)
        cell.app.stage.off("mouseup", this.v2_mouseUp);

        cell.app.stage.removeChild(this.move_cursor);
        cell.app.view.setAttribute("style", "cursor:default");

        if (this.v2_cursorVisible) {
            this.to(e.data.global.x, e.data.global.y)
        }
        this.v2_cursorVisible = false;
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

    private move() {
        if (++this.frame % 10 === 0) {
            if (!cell.user_controller.usePA(1, true)) {
                return cell.app.ticker.remove(this._move)
            }
        }

        let speed = 1.5;

        let target;

        if (this.targets.length > 0) {

            target = this.targets[0]

            // Get the angle between user and the next destination
            let angle = Math.atan2(target[1] - this.user.y, target[0] - this.user.x)

            this.user.animate(true, angle);

            // Slows down before reaching the end destination
            if (this.targets.length === 1) {
                if (Math.abs(target[0] - this.user.x) < 20 && Math.abs(target[1] - this.user.y) < 20) {
                    speed = Math.max(Math.abs(target[0] - this.user.x), Math.abs(target[1] - this.user.y)) * 1.5 / 20;
                }
            }

            // Move the user
            this.user.x += Math.cos(angle) * speed
            this.user.y += Math.sin(angle) * speed

            this.reorganizeBuildings();
        } else {
            // Special case where the user moves to the position he is on already
            // This avoids the targets[0] undefined error
            target = [this.user.x, this.user.y]
        }

        // Reaches the end destination
        if (Math.abs(target[0] - this.user.x) < 2 && Math.abs(target[1] - this.user.y) < 2) {
            this.targets.shift();
            if (this.targets.length === 0) {
                if (this.callback) {
                    this.callback()
                }
                this.user.animate(false);
                cell.app.ticker.remove(this._move)

                Axios.post("/api/actions/move", {
                    x: Math.round(this.user.x),
                    y: Math.round(this.user.y)
                });
            }
        }
    }

    private reorganizeBuildings() {
        // Reorganize the buildings to allow passing behind them
        for (let i = 0; i < cell.arBuildings.length; i++) {
            const building = cell.arBuildings[i];
            if (this.user.y < building.container.y + building.horizon) {
                if (building.front === false || building.front === undefined) {
                    building.container.parent.addChild(building.container)
                    building.front = true;
                }
            } else if (building.front === true || building.front === undefined) {
                building.container.parent.addChildAt(building.container, 0)
                building.front = false;
            }
        }
    }
}