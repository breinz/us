import { ItemModel } from "./back/item/model";
import { UserItemModel } from "./back/user/model";
import { CellItemModel } from "./back/cell/model";

declare namespace Us {

    // Default Api return
    type ApiResult = {
        default: {
            success: boolean,
            error?: string,
            fatal?: string
        },
    }

    namespace Safe {

        namespace ApiResult {

            type Open = Us.ApiResult["default"] & {
                now?: number,
                item?: CellItemModel,
                direction?: number,
                /** The user who opened the safe */
                by: string
            };

            type Poison = Us.ApiResult["default"] & {
                poison: number
            }

        }
    }

    namespace Well {
        namespace ApiResult {
            type getWater = Us.ApiResult["default"] & {
                wellId?: number,
                rations?: number,
                poison?: number,
                bag?: UserItemModel[]
            }

            type addWater = Us.ApiResult["default"] & {
                wellId?: number,
                rations?: number,
                bag?: UserItemModel[]
            }

            type poison = Us.ApiResult["default"] & {
                wellId?: number,
                poison?: number,
                bag?: UserItemModel[]
            }
        }
    }

    namespace Map {
        type Cell = {
            _id: string,
            ground: string,
            done: boolean,
            neighbors: {
                top: Map.Cell.Neighbor,
                right: Map.Cell.Neighbor,
                left: Map.Cell.Neighbor,
                bottom: Map.Cell.Neighbor
            }
        }

        namespace Cell {
            type Neighbor = {
                _id: string,
                ground: string
            }
        }
    }

}