import * as mongoose from "mongoose"
import { Document, Schema, model } from "mongoose"

// --------------------------------------------------
// Type

export type BuildingModel = Document & {
    name: string,
    x: number,
    y: number
}

// --------------------------------------------------
// Schema

export const buildingSchema = new Schema({
    name: String,
    x: Number,
    y: Number
})

// --------------------------------------------------
// Model

export const Building = model("Building", buildingSchema)
export default Building
