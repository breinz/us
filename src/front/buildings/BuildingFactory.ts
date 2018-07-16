/**
 * BuildingFactory
 * Create a building according to its type
 */
import Home from "./Home";
import Well from "./Well";
import ABuilding from "./ABuilding";

export type BuildingData = {
    _id: string,
    x: number,
    y: number,
    rations?: number,
    poison?: number,
    building: {
        name: string,
        offset: {
            top: number,
            right: number,
            bottom: number,
            left: number
        }
    }
}

class BuildingFactory {

    private constructor() {

    }

    public static create(data: BuildingData, layer: PIXI.Container): ABuilding {
        switch (data.building.name) {
            case "home":
                return new Home(data, layer);
            case "well":
                return new Well(data, layer);
        }
    }
}

export default BuildingFactory;