import * as mongoose from "mongoose"
import { Document, Schema, model } from "mongoose"

export type GameModel = Document & {
    count_users: number
}

// Schema
const gameSchema = new Schema({
    count_users: {type: Number, default: 0}
}, { timestamps: true })

export const Game = model("Game", gameSchema)
export default Game
