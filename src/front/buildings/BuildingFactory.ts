/**
 * BuildingFactory
 * Create a building according to its type
 */
import Home from "./Home";
import Well from "./Well";
import ABuilding from "./ABuilding";
import Hatch from "./Hatch";
import Church from "./Church";
import Safe from "./Safe";
import { CellBuildingModel } from "../../back/cell/model";

class BuildingFactory {

    private constructor() {

    }

    public static create(data: CellBuildingModel /*BuildingData*/, layer: PIXI.Container): ABuilding {
        switch (data.building.name) {
            case "home":
                return new Home(data, layer);
            case "well":
                return new Well(data, layer);
            case "hatch":
                return new Hatch(data, layer)
            case "church":
                return new Church(data, layer)
            case "safe":
                return new Safe(data, layer)
        }
    }
}

export default BuildingFactory;