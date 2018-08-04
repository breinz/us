import { cell } from "../main";
import IPnj from "./IPnj";

export default class Move {

    private targets: number[][];

    private pnj: IPnj;

    private frame: number;

    private callback: () => void;

    private move_fct: () => void;

    constructor(pnj: IPnj) {
        this.pnj = pnj;

        this.move_fct = this._move.bind(this)
    }

    public to(x: number, y: number, callback: () => void) {
        cell.app.ticker.remove(this.move_fct);

        this.callback = callback;

        this.targets = cell.grid.findPath(this.pnj.x, this.pnj.y, x, y)
        this.targets.shift();

        this.frame = 0;
        cell.app.ticker.add(this.move_fct)
    }

    private _move() {
        let speed = 1;
        let target;

        if (this.targets.length > 0) {

            target = this.targets[0]

            // Get the angle between pnj and the next destination
            let angle = Math.atan2(target[1] - this.pnj.y, target[0] - this.pnj.x)

            this.pnj.animate(true, angle);

            // Slows down before reaching the end destination
            if (this.targets.length === 1) {
                if (Math.abs(target[0] - this.pnj.x) < 20 && Math.abs(target[1] - this.pnj.y) < 20) {
                    speed = Math.max(Math.abs(target[0] - this.pnj.x), Math.abs(target[1] - this.pnj.y)) * 1.5 / 20;
                }
            }

            // Move the pnj
            this.pnj.x += Math.cos(angle) * speed
            this.pnj.y += Math.sin(angle) * speed

            //this.reorganizeBuildings();
        } else {
            // Special case where the pnj moves to the position he is on already
            // This avoids the targets[0] undefined error
            target = [this.pnj.x, this.pnj.y]
        }

        // Reaches the end destination
        if (Math.abs(target[0] - this.pnj.x) < 2 && Math.abs(target[1] - this.pnj.y) < 2) {
            this.targets.shift();
            if (this.targets.length === 0) {
                if (this.callback) {
                    this.callback()
                }
                this.pnj.animate(false);
                cell.app.ticker.remove(this.move_fct)

                /*Axios.post("/api/actions/move", {
                    x: Math.round(this.user.x),
                    y: Math.round(this.user.y)
                });*/
            }
        }
    }
}