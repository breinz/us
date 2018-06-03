import * as mongoose from "mongoose"
import { Document, Schema, model, Model } from "mongoose"
import { BuildingModel, buildingSchema, Building } from "../building/model";
import { Game, GameModel } from "../game/model";
import { shuffle } from "../../helper";
import { ItemModel } from "../item/model";

// --------------------------------------------------
// Type

export type CellBuildingModel = Document & {
    building: mongoose.Types.ObjectId,
    x: number,
    y: number,
    rations?: number
}

export type CellModel = Document & {
    gameId: mongoose.Types.ObjectId,
    x: number,
    y: number,
    homeForTeam?: number,
    joined?: number,
    buildings?: [CellBuildingModel] & Document,
    items: [{
        _id: any,
        item: ItemModel
    }],

    isHome: () => boolean,
    findToJoin: (gameId: mongoose.Types.ObjectId) => CellModel
}

// --------------------------------------------------
// Schema

export const CellBuildingSchema = new Schema({
    building: {type: mongoose.Schema.Types.ObjectId, ref: "Building"},
    x: Number,
    y: Number,
    rations: Number
})

export const cellSchema = new Schema({
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
    x: Number,
    y: Number,
    joined: Number,
    homeForTeam: Number,
    buildings: [CellBuildingSchema],
    items: [{type: mongoose.Schema.Types.ObjectId, ref: "Item" }]
})

// --------------------------------------------------
// Methods

cellSchema.pre("save", async function presave (next) {
    let cell = <CellModel>this;

    if (cell.isNew) {
        if (cell.isHome()) {
            let home = <BuildingModel>await Building.findOne({name: "home"})
            cell.buildings.push(
                <CellBuildingModel>{
                    building: home.id,
                    x: 200,
                    y: 250
                }
            )

            let well = <BuildingModel>await Building.findOne({name: "well"})
            cell.buildings.push(
                <CellBuildingModel>{
                    building: well.id,
                    x: 225,
                    y: 200,
                    rations: Math.round(Math.random()*25)+50
                }
            )

            next()
        }
    }
})

/**
 * Is this cell home for a team
 * @return Boolean
 */
cellSchema.methods.isHome = function () {
    const cell = <CellModel>this;

    return cell.homeForTeam !== undefined && cell.homeForTeam !== null
}

/**
 * Find a cell to join a game
 * @param gameId The game
 * - has to be a home cell
 * - has to have room for this new player to come
 */
cellSchema.statics.findToJoin = async function (gameId: mongoose.Types.ObjectId) {
    let cells = <CellModel[]>await Cell.find({ gameId: gameId, joined: { $lt : 4 } } )
    cells = <CellModel[]>shuffle(cells);
    return cells[0]
}

// --------------------------------------------------
// Model

export const Cell = <Model<Document> & CellModel>model("Cell", cellSchema)
export const CellBuilding = <Model<Document> & CellBuildingModel>model("CellBuilding", CellBuildingSchema)
export default Cell
