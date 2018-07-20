import * as mongoose from "mongoose"
import { Document, Schema, model } from "mongoose"

// --------------------------------------------------
// Type

export type BuildingModel = Document & {
    name: string,
    x: number,
    y: number,
    offset: {
        left: number,
        right: number,
        top: number,
        bottom: number
    },
    hitArea: {
        x: number,
        y: number,
        width: number,
        height: number
    }
}

// --------------------------------------------------
// Schema

export const buildingSchema = new Schema({
    name: String,
    x: Number,
    y: Number,
    offset: {
        left: Number,
        right: Number,
        top: Number,
        bottom: Number
    },
    hitArea: {
        x: Number,
        y: Number,
        width: Number,
        height: Number
    }
})

// --------------------------------------------------
// Model

export const Building = model("Building", buildingSchema)
export default Building
