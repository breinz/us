import * as mongoose from "mongoose"
import { Document, Schema, model, Model } from "mongoose"
import { BuildingModel, buildingSchema, Building } from "../building/model";
import { shuffle } from "../../helper";
import { ItemModel } from "../item/model";
import { UserItemModel } from "../user/model";

// --------------------------------------------------
// Type

export type CellItemModel = UserItemModel & {
    x: number,
    y: number
};

export type CellBuildingModel = Document & {
    _id: string,
    x: number,
    y: number,
    rations?: number,
    poison?: number,
    building: mongoose.Types.ObjectId & BuildingModel,
    visited?: mongoose.Types.Array<{
        by: mongoose.Types.ObjectId,
        at: Date | string
    }>,

    isOpen: (delay: number) => boolean
}

export type CellModel = Document & {
    gameId: mongoose.Types.ObjectId,
    x: number,
    y: number,
    ground: string,
    homeForTeam?: number,
    joined?: number,
    test: string,
    neighbors: {
        left: mongoose.Types.ObjectId | CellModel,
        right: mongoose.Types.ObjectId | CellModel,
        top: mongoose.Types.ObjectId | CellModel,
        bottom: mongoose.Types.ObjectId | CellModel
    },
    buildings?: mongoose.Types.Array<CellBuildingModel> & Document,
    items?: mongoose.Types.Array<CellItemModel> & Document,

    isHome: () => boolean,
    findToJoin: (gameId: mongoose.Types.ObjectId) => CellModel,
    addBuildings: (structure: string, teamId: number) => Promise<boolean>,
    setNeighbor: (direction: string, neighbor: CellModel) => void
}

// --------------------------------------------------
// Schema

export const cellBuildingSchema = new Schema({
    building: { type: mongoose.Schema.Types.ObjectId, ref: "Building" },
    x: Number,
    y: Number,
    rations: Number,
    poison: { type: Number, default: 0 },
    visited: [{
        by: mongoose.Schema.Types.ObjectId,
        at: Date
    }]
})

export const cellSchema = new Schema({
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
    x: Number,
    y: Number,
    ground: String,
    joined: Number,
    neighbors: {
        left: mongoose.Schema.Types.ObjectId,
        right: mongoose.Schema.Types.ObjectId,
        top: mongoose.Schema.Types.ObjectId,
        bottom: mongoose.Schema.Types.ObjectId,
    },
    homeForTeam: Number,
    buildings: [cellBuildingSchema]
})

// --------------------------------------------------
// Methods

cellBuildingSchema.methods.isOpen = function (delay: number = 1000 * 60 * 60 * 6): boolean {
    const cellBuilding = this as CellBuildingModel;
    console.log("isOpen", cellBuilding.visited.length);

    if (!cellBuilding.visited) {
        return false;
    }

    if (cellBuilding.visited.length < 1) {
        return false;
    }

    const at = cellBuilding.visited[cellBuilding.visited.length - 1].at;
    if (new Date(at) > new Date(Date.now() - delay)) {
        return true;
    }

    return false;
}

/**
 * Is this cell home for a team
 * @return Boolean
 */
cellSchema.methods.isHome = function () {
    const cell = <CellModel>this;

    return cell.homeForTeam !== undefined && cell.homeForTeam !== null
}

/**
 * Set the neighbor cell, two ways
 * @param direction 
 * @param neighbor
 */
cellSchema.methods.setNeighbor = async function (direction: "left" | "right" | "top" | "bottom", neighbor: CellModel) {
    (<CellModel>this).neighbors[direction] = neighbor.id;
    await this.save();
    direction = direction === "left" ? "right" : (direction === "right" ? "left" : (direction === "top" ? "bottom" : "top"));
    neighbor.neighbors[direction] = this.id
    await neighbor.save();
}

/**
 * Add buildings to the cell
 * @param structure The structure [ground][...buildings]
 */
cellSchema.methods.addBuildings = async function (structure: string, teamId: number): Promise<boolean> {
    const cell = this as CellModel;

    let isHome = false;

    structure = structure.substr(1);
    cell.test = structure;

    const arBuildings = structure.split("");

    let letter: string;
    for (let i = 0; i < arBuildings.length; i++) {
        letter = arBuildings[i];
        switch (letter) {
            case "H":
                cell.homeForTeam = teamId;
                let home = await Building.findOne({ name: "home" }) as BuildingModel
                cell.buildings.push(
                    <CellBuildingModel>{
                        x: 200, /** @todo find the right place */
                        y: 250,
                        building: home.id
                    }
                );
                isHome = true;
                break;
            case "W":
                let well = await Building.findOne({ name: "well" }) as BuildingModel;
                cell.buildings.push(
                    <CellBuildingModel>{
                        x: 1,
                        y: 1,
                        rations: Math.round(Math.random() * 50 + 20),
                        building: well.id
                    }
                )
                break;
            case "C":
                let church = await Building.findOne({ name: "church" }) as BuildingModel;
                cell.buildings.push(
                    <CellBuildingModel>{
                        x: 150,
                        y: 150,
                        building: church.id
                    }
                )
                break;
            case "S":
                const safe = await Building.findOne({ name: "safe" }) as BuildingModel;
                cell.buildings.push(
                    <CellBuildingModel>{
                        x: 120,
                        y: 40,
                        building: safe.id
                    }
                )
                break;
            default:
                throw "Building not implemented to add onto cell";
        }
    }

    return isHome;
}

/**
 * Find a cell to join a game
 * @param gameId The game
 * - has to be a home cell
 * - has to have room for this new player to come
 */
cellSchema.statics.findToJoin = async function (gameId: mongoose.Types.ObjectId) {
    let cells = await Cell.find({ gameId: gameId, joined: { $lt: 4 } }) as CellModel[];
    cells = shuffle(cells) as CellModel[];
    return cells[0];
}

// --------------------------------------------------
// Model

export const Cell = model("Cell", cellSchema) as Model<Document> & CellModel
export const CellBuilding = model("CellBuilding", cellBuildingSchema) as Model<Document> & CellBuildingModel
export default Cell
