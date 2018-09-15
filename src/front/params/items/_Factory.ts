import { IItemParams } from "./IItemParams";
import { PistolParams, AmmoParams } from ".";
import ItemParams from "../ItemParams";
import { BottleFullParams } from "./BottleFullParams";
import { BaseBallBatParams } from "./BaseBallBat";
import { StringParams } from "./StringParams";

export class FItemParams {

    static get(ref: ItemParams): IItemParams {
        switch (ref.props.item.item.name) {
            case "pistol":
                return new PistolParams(ref)
            case "ammo":
                return new AmmoParams(ref);
            case "bottle_full":
                return new BottleFullParams(ref);
            case "baseball_bat":
                return new BaseBallBatParams(ref);
            case "string":
                return new StringParams(ref);
            default:
                return null;
        }
    }
}