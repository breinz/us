import {Document, Schema, model, } from "mongoose"

export type GoalModel = Document & {
    phrase: string
}

export type LevelModel = Document & {
    level: number,
    goals: Array<GoalModel> & Document
}



const goalSchema = new Schema({
    phrase: String
})

// Schema
const levelSchema = new Schema({
    level: { type: Number },
    goals: [ {
        phrase: String
    } ]
})

export const Level = model("Level", levelSchema)
export const Goal = model("Goal", goalSchema)
export default Level
