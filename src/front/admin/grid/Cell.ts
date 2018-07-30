import GridAdmin from "./GridAdmin";

export default class Cell extends PIXI.Container {

    private bg: PIXI.Graphics;

    private grid: GridAdmin

    constructor(grid: GridAdmin) {
        super()

        this.grid = grid;

        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0xFF0000, .5)
        this.bg.drawRect(0, 0, 20, 20);
        this.bg.alpha = 0;
        this.addChild(this.bg)

        const border = new PIXI.Graphics();
        border.lineStyle(1);
        border.drawRect(0, 0, 20, 20);
        this.addChild(border)

        this.interactive = true;

        this.on("mousedown", this.onMouseDown.bind(this))
        this.on("mouseover", this.onMouseOver.bind(this))
    }

    public get value(): number {
        return this.bg.alpha;
    }

    private onMouseDown() {
        this.bg.alpha = this.bg.alpha === 0 ? 1 : 0;
        this.grid.draw = this.bg.alpha;
    }

    private onMouseOver() {
        if (isNaN(this.grid.draw)) return;
        this.bg.alpha = this.grid.draw;
        this.grid.update();
    }
}