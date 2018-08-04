import { BuildingData } from "./BuildingFactory";
import IElement from "../params/IElement";

interface IBuilding extends IElement {
    data: BuildingData;
}

export default IBuilding

