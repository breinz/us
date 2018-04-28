import {Document, Schema, model } from "mongoose"

// --------------------------------------------------
// Types
// --------------------------------------------------

export type LevelModel = Document & {
    level: number,
    color: number,
    outerDist: number,
    innerDist: number
}

// --------------------------------------------------
// Schemas
// --------------------------------------------------

export const levelSchema = new Schema({
    level: Number,
    color: Number,
    outerDist: Number,
    innerDist: Number
})

// --------------------------------------------------
// Models
// --------------------------------------------------

export const Level = model("Level", levelSchema)