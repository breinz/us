import { Document, Schema, model } from "mongoose";


// --------------------------------------------------
// Types
// --------------------------------------------------
export type MapModel = Document & {
    name: string,
    width: number,
    height: number,
    structure: string
}

// --------------------------------------------------
// Schemas
// --------------------------------------------------

export const mapSchema = new Schema({
    name: String,
    width: Number,
    height: Number,
    structure: String
})

// --------------------------------------------------
// Models
// --------------------------------------------------

export const Map = model("Map", mapSchema)