import * as mongoose from "mongoose"
import { Document, Schema, model, Model } from "mongoose"
import { CellModel, cellSchema, Cell } from "../cell/model";

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
    count_users: {type: Number, default: 0},
    cells: [ { type: mongoose.Schema.Types.ObjectId, ref: "Cell" } ]
}, { timestamps: true })

// --------------------------------------------------
// Methods

/**
 * Pre save
 * @todo remove await from the loop (-> slow down)
 */
gameSchema.pre("save", async function save(next) {
    let game = <GameModel>this;

    const w = 5;
    const h = 5;

    const isHome = (x:Number, y:Number) => {
        if (x === 1 && y === 1) return true;
        if (x === 1 && y === h-2) return true;
        if (x === w-2 && y === 1) return true;
        if (x === w-2 && y === h-2) return true;
        return false
    }

    if (game.isNew) {
        
        let cell:CellModel;
        let params:{
            x: number, 
            y: number, 
            homeForTeam?: number,
            joined?: number,
            gameId: mongoose.Types.ObjectId,
        };
        let teamId:number = 0;

        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                params = { x: x, y: y, gameId: game.id };
                if (isHome(x, y)) {
                    params.homeForTeam = teamId;
                    params.joined = 0,
                    teamId++
                }

                // Add a cell
                cell = <CellModel>new Cell(params)
                await cell.save()

                game.cells.push(cell.id)
            }
        }

        next()
    }
})

/**
 * Finds a game to join or create a new one
 */
gameSchema.statics.findToJoin = async function () {
    let game:GameModel = await this.findOne({count_users: { $lt: 20 } })

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
