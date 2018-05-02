/**
 * BuildingFactory
 * Create a building according to its type
 */
import Home from "./home";
import Weel from "./weel";

export type BuildingData = {
    _id: string,
    x: number,
    y: number,
    rations?: Number,
    building: {
        name: string
    }
}

class BuildingFactory {

    private constructor () {

    }

    public static create(data:BuildingData, layer:PIXI.Container) {
        switch (data.building.name) {
            case "home":
                return new Home(data, layer);
            case "weel":
                return new Weel(data, layer);
        }
    }
}

export default BuildingFactory;