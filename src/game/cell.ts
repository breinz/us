import * as Pixi from "pixi.js"
import * as h from "./helper"
import axios from "axios"
import { buildingSchema } from "../building/model";
import BuildingFactory, { BuildingData } from "./buildings/BuildingFactory";

class Cell {

    /**
     * Pixi application
     */
    public app:Pixi.Application;

    constructor() {
        Pixi.utils.skipHello();
        this.app = new Pixi.Application({
            width:560,
            height: 560,
            transparent: true,
            antialias: true
        })
        document.getElementById("cell").appendChild(this.app.view)

        this.init()
    }

    init = async () => {
        
        // buildings layer
        var buildings = new Pixi.Container();
        this.app.stage.addChild(buildings);

        // Get the cell's data
        var cell = await axios.get("/api/cell")

        // Draw the buildings
        cell.data.buildings.forEach((building:BuildingData) => {
            BuildingFactory.create(building, buildings)
        });

        this.drawBorder();
    }

    /**
     * Border around the canvas
     */
    drawBorder = () => {
        let border = new PIXI.Graphics();
        border.lineStyle(1, 0x707070)
        border.drawRect(0.5, 0.5, this.app.view.width-1, this.app.view.height-1)
        this.app.stage.addChild(border)
    }
}

export default Cell