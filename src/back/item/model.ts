import {Document, Schema, model, Model, Types, DocumentQuery } from "mongoose"

// --------------------------------------------------
// Types
// --------------------------------------------------
export type ItemModel = Document & {
    name: string,
    x: number,
    y: number,
    weight: number,
    frequency: number, /** chances to find this object ]100] */
    frequency_change: number, /** on each dig the frequency doesn't change (0), goes up (1) or down (-1) */
    frequency_limit: number, /** up to where the frequency can go */

    findByName: (name: string) => DocumentQuery<Document, Document>
}

// --------------------------------------------------
// Schemas
// --------------------------------------------------

export const itemSchema = new Schema({
    name: String,
    x: Number,
    y: Number,
    weight: Number,
    frequency: Number,
    frequency_change: Number,
    frequency_limit: Number
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