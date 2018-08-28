import { cell } from "../main";
import * as Path from "pathfinding"
import dispatcher from "../dispatcher";

type Coords = { x: number, y: number };

export default class Grid extends PIXI.Container {

    private static CELL_SIZE: number = 20

    private COLS: number;
    private ROWS: number;
    private arCells: PIXI.Graphics[][]
    private arClean: PIXI.Graphics[] = []

    private grid: Path.Grid;

    private finder: Path.BestFirstFinder;

    constructor() {
        super();

        this.grid = new Path.Grid(
            cell.app.view.width / Grid.CELL_SIZE,
            cell.app.view.height / Grid.CELL_SIZE
        );

        this.finder = new Path.BestFirstFinder({ diagonalMovement: 4 })

        // --------------------------------------------------
        this.arCells = []
        let ar: PIXI.Graphics[]

        this.COLS = cell.app.view.width / Grid.CELL_SIZE
        this.ROWS = cell.app.view.height / Grid.CELL_SIZE

        for (let j = 0; j < this.ROWS; j++) {
            ar = [];
            for (let i = 0; i < this.COLS; i++) {
                let s = new PIXI.Graphics()
                s.x = i * Grid.CELL_SIZE
                s.y = j * Grid.CELL_SIZE
                s.visible = false;
                this.addChild(s)
                ar.push(s)
            }
            this.arCells.push(ar);
        }
        // --------------------------------------------------

        dispatcher.on(dispatcher.DEV_SHOW_GRID, this.onShowGrid.bind(this))
    }

    private onShowGrid() {
        for (let i = 0; i < this.ROWS; i++) {
            for (let j = 0; j < this.COLS; j++) {
                const cell = this.arCells[j][i];
                cell.visible = !cell.visible;
                if (cell.visible) {
                    cell.clear()
                    if (this.grid.isWalkableAt(i, j)) {
                        cell.lineStyle(.5, 0)
                        cell.drawRect(0, 0, Grid.CELL_SIZE, Grid.CELL_SIZE)
                    } else {
                        cell.beginFill(0x00FFFF, .5)
                        cell.drawRect(0, 0, Grid.CELL_SIZE, Grid.CELL_SIZE)
                    }
                }
            }
        }
    }

    /**
     * Add an obstacle in the grid
     * @param obj The object to set non walkable
     */
    public addObstacle(obj: PIXI.Container, offset: { x: number, y: number }, obstacle?: { x: number, y: number, width: number, height: number }) {

        if (obstacle === undefined) {
            obstacle = {
                x: 0,
                y: 0,
                width: 20,
                height: 20
            }
        }

        let start = this.findSquare({
            x: obj.x - offset.x + obstacle.x + 1,
            y: obj.y - offset.y + obstacle.y + 1
        })

        let end = this.findSquare({
            x: obj.x - offset.x + obstacle.x + obstacle.width - 2,
            y: obj.y - offset.y + obstacle.y + obstacle.height - 2
        })

        for (let x = start.x; x <= end.x; x++) {
            for (let y = start.y; y <= end.y; y++) {
                this.grid.setWalkableAt(x, y, false)
            }
        }
    }

    public load(data: string) {
        const arData = data.split(",")
        let walkable = arData.shift() === "0"
        let index = 0;
        let count = 0;
        for (let i = 0; i < this.ROWS * this.COLS; i++) {
            this.grid.setWalkableAt(i % this.ROWS, Math.floor(i / this.COLS), walkable)
            if (++count >= parseInt(arData[index])) {
                walkable = !walkable;
                count = 0;
                index++;
            }
        }
    }

    /**
     * Find a square in the grid
     * @param coords The coords in pixels
     * @return The coords in the grid
     */
    private findSquare(coords: Coords): Coords {
        return {
            x: Math.floor(coords.x / Grid.CELL_SIZE),
            y: Math.floor(coords.y / Grid.CELL_SIZE),
        }
    }

    /**
     * Find the "closest" walkable cell, by turning around the cell (top, top-right, right, right-bottom ...) until one is walkable
     * @todo Can certainly be improved but sor far so good
     * @param start Start cell (not used now)
     * @param end End cell
     * @param turn inner use only
     */
    private findEndWalkableSquare(start: Coords, end: Coords, turn?: number): Coords {
        // Just to make sure the end square is indeed not walkable
        if (this.grid.isWalkableAt(end.x, end.y)) {
            return end;
        }

        const new_end = { x: end.x, y: end.y }

        if (turn === undefined) turn = 1;

        const mod_turn = turn % 8
        const num = Math.ceil(turn / 8)

        if (mod_turn <= 2) {
            new_end.y += num
        }
        if (mod_turn >= 2 && mod_turn <= 4) {
            new_end.x += num
        }
        if (mod_turn >= 4 && mod_turn <= 6) {
            new_end.y -= num
        }
        if (mod_turn >= 6 && mod_turn <= 8) {
            new_end.x -= num
        }

        if (this.grid.isWalkableAt(new_end.x, new_end.y)) {
            return new_end;
        }

        return this.findEndWalkableSquare(start, end, ++turn)
    }

    private toPix(value: number): number {
        return value * Grid.CELL_SIZE + Grid.CELL_SIZE / 2
    }

    /**
     * Find a path from start to end
     * @param start_x Start position x in pixels
     * @param start_y Start position y in pixels
     * @param end_x End position x in pixels
     * @param end_y End position y in pixels
     * @return number[][] a list of positions in pixels from start to end
     */
    public findPath(start_x: number, start_y: number, end_x: number, end_y: number): number[][] {
        // convert into squares
        let start = this.findSquare({ x: start_x, y: start_y })
        let end = this.findSquare({ x: end_x, y: end_y })

        let end_walkable = true

        if (!this.grid.isWalkableAt(end.x, end.y)) {
            end_walkable = false;
            end = this.findEndWalkableSquare(start, end)
        }

        // Find path
        let cells = this.finder.findPath(start.x, start.y, end.x, end.y, this.grid.clone())

        // --------------------------------------------------
        for (let i = 0; i < this.arClean.length; i++) {
            this.arClean[i].clear()
            this.arClean[i].lineStyle(1).drawRect(0, 0, Grid.CELL_SIZE, Grid.CELL_SIZE)
        }
        this.arClean = []
        for (let i = 0; i < cells.length; i++) {
            let s = this.arCells[cells[i][1]][cells[i][0]]
            s.beginFill(0x0000FF, .3)
            s.drawRect(0, 0, Grid.CELL_SIZE, Grid.CELL_SIZE)
            this.arClean.push(s)
        }
        // --------------------------------------------------

        // Smoothen path
        //cells = Path.Util.smoothenPath(this.grid.clone(), cells)
        cells = Path.Util.compressPath(cells)

        // --------------------------------------------------
        for (let i = 0; i < cells.length; i++) {
            let s = this.arCells[cells[i][1]][cells[i][0]]
            s.beginFill(0xFF0000, .3)
            s.drawRect(0, 0, Grid.CELL_SIZE, Grid.CELL_SIZE)
        }
        // --------------------------------------------------

        // Convert into pixels
        cells.forEach(ar => {
            ar[0] = this.toPix(ar[0])
            ar[1] = this.toPix(ar[1])
        })

        // Replace end by actual end position
        if (end_walkable) {
            cells[cells.length - 1][0] = end_x //this.toPix(end.x)
            cells[cells.length - 1][1] = end_y //this.toPix(end.y)
        }

        return cells;
    }
}