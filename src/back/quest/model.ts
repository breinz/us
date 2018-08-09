import { Document, Schema, model, Model, Types } from "mongoose"

// --------------------------------------------------
// Types
// --------------------------------------------------
export type QuestModel = Document & {
    name: string,
}

// --------------------------------------------------
// Schemas
// --------------------------------------------------

export const questSchema = new Schema({
    name: String,
})

// --------------------------------------------------
// Models
// --------------------------------------------------

export const Quest = model("Quest", questSchema)