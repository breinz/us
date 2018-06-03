import Cell from "./Cell";

export default class End extends PIXI.Graphics {

    constructor(cell: Cell) {
        super()

        this.beginFill(0)
        this.drawCircle(0, 0, 15)
        this.x = cell.centerx
        this.y = cell.centery
    }

    public kill() {
        this.parent.removeChild(this)
    }
}