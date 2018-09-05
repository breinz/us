import { Document, Schema, model, Model, Types, DocumentQuery } from "mongoose"

// --------------------------------------------------
// Types
// --------------------------------------------------
export type ItemModel = Document & {
    name: string,
    x: number, y: number,
    weight: number,
    frequency: number,
    frequency_change: number,
    frequency_limit: number,
    in_safe: boolean,

    findByName: (name: string) => DocumentQuery<Document, Document>
}

// --------------------------------------------------
// Schemas
// --------------------------------------------------

export const itemSchema = new Schema({
    name: String,

    /** Position in the big picture */
    x: Number,
    y: Number,

    /** Item's weight (0 light, 1 normal, 2 heavy) */
    weight: { type: Number, default: 1 },

    /** chances to find this object ]100] */
    frequency: Number,

    /** on each dig the frequency doesn't change (0), goes up (1) or down (-1) */
    frequency_change: Number,

    /** up to where the frequency can go */
    frequency_limit: Number,

    in_safe: { type: Boolean, default: false }
})

/**
 * Find by name
 * @param name The item's name
 */
itemSchema.methods.findByName = function (name: string) {
    return Item.findOne({ name: name })
}
// --------------------------------------------------
// Models
// --------------------------------------------------

export const Item = <Model<Document> & ItemModel>model("Item", itemSchema)