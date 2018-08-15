import * as mongoose from "mongoose"
import { Document, Schema, model, Model } from "mongoose"
import { CellModel, cellSchema, Cell } from "../cell/model";
import { Map, MapModel } from "../map/model";

// --------------------------------------------------
// Type

export type GameModel = Document & {
    count_users: number,
    cells: [mongoose.Types.ObjectId],

    findToJoin: () => GameModel
}
// --------------------------------------------------
// Schema

const gameSchema = new Schema({
    count_users: { type: Number, default: 0 },
    cells: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cell" }]
}, { timestamps: true })

// --------------------------------------------------
// Methods

/**
 * Pre save
 * @todo remove await from the loop (-> slow down)
 */
gameSchema.pre("save", async function save(next) {
    let game = <GameModel>this;

    /*const w = 5;
    const h = 5;

    const isHome = (x: Number, y: Number) => {
        if (x === 1 && y === 1) return true;
        if (x === 1 && y === h-2) return true;
        if (x === w-2 && y === 1) return true;
        if (x === w-2 && y === h-2) return true;
        return false
    }*/

    if (game.isNew) {

        // Find a map
        const map = await Map.findOne({ name: "test" }) as MapModel; /** @todo conditions */

        let arStructure = map.structure.split(",");
        let structure_index = 0;

        let cell: CellModel;
        let params/*: {
            x: number,
            y: number,
            homeForTeam?: number,
            joined?: number,
            gameId: mongoose.Types.ObjectId,
            ground: string
        };*/
        let teamId: number = 0;

        let cell_structure: string;

        let prev_cell: CellModel;
        let first_of_row: CellModel;

        let arCells: CellModel[] = [];

        for (let y = 0; y < map.height; y++) {
            first_of_row = null;
            for (let x = 0; x < map.width; x++) {
                cell_structure = arStructure[structure_index];
                console.log(cell_structure);

                params = {
                    x: x,
                    y: y,
                    gameId: game.id,
                    ground: cell_structure.substr(0, 1),
                    joined: 0,
                };

                cell = <CellModel>new Cell(params)
                // [row] link to left
                if (prev_cell) {
                    await cell.setNeighbor("left", prev_cell);
                }
                // [row] link the first to the last
                if (x === map.width - 1) {
                    await first_of_row.setNeighbor("left", cell);
                }
                if (await cell.addBuildings(cell_structure, teamId)) {
                    teamId++;
                }
                await cell.save()

                game.cells.push(cell.id)

                structure_index++;

                // Save cells for row link
                prev_cell = cell;
                if (first_of_row === null) {
                    first_of_row = cell;
                }

                // Save cells for col link
                arCells.push(cell);

                // [col] link top
                if (y > 0) {
                    await cell.setNeighbor("top", arCells[(y - 1) * map.height + x]);
                }
                // [col] link first to last
                if (y === map.height - 1) {
                    await arCells[x].setNeighbor("top", cell);
                }
            }
        }

        /** @todo save all cells */
        /*for (let i = 0; i < arCells.length; i++) {
            await arCells[i].save();
        }*/

        next()
    }
})

/**
 * Finds a game to join or create a new one
 */
gameSchema.statics.findToJoin = async function () {
    let game: GameModel = await this.findOne({ count_users: { $lt: 20 } })

    if (!game) {
        game = <GameModel>new Game()
        game = await game.save()
        // create cells @see pre save
    }

    return game
}

// --------------------------------------------------
// Model

export const Game = <Model<Document> & GameModel>model("Game", gameSchema)
export default Game
