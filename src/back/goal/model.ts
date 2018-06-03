import {Document, Schema, model, Model, Types } from "mongoose"
import { LevelModel, levelSchema } from "../level/model"

// --------------------------------------------------
// Types
// --------------------------------------------------
export type GoalModel = Document & {
    level: Types.ObjectId,
    phrase: string,
}

// --------------------------------------------------
// Schemas
// --------------------------------------------------

export const goalSchema = new Schema({
    level: { type: Schema.Types.ObjectId, ref:"Level" },
    phrase: String,
})

// --------------------------------------------------
// Models
// --------------------------------------------------

export const Goal = model("Goal", goalSchema)