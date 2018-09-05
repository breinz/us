import IElement from "../params/IElement";
import { CellBuildingModel } from "../../back/cell/model";

interface IBuilding extends IElement {
    data: CellBuildingModel/* BuildingData*/;
}

export default IBuilding

