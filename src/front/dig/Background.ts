import { cell } from "../main"

export default class Background extends PIXI.Container {

    constructor() {
        super()

        // Background image
        var t = PIXI.Sprite.fromImage("img/backgrounds/dig.png");
        this.addChild(t)
        t.interactive = true;

        const s = cell.app.view.width;

        // Border
        var b = new PIXI.Graphics()
        b.lineStyle(4, 0)
        b.drawRect(2, 2, s - 4, s - 4)
        this.addChild(b)
    }
}