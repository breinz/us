import * as express from "express"
import { Building, BuildingModel } from "../back/building/model";
import { Cell, CellModel, CellBuildingModel } from "../back/cell/model";
import { UserModel, UserItemModel, User } from "../back/user/model";
import { Item, ItemModel } from "../back/item/model";

let router = express.Router()

/**
 * Empty the bag
 */
router.post("/clearBag", async (req, res) => {
    const user = req.user as UserModel;
    for (let i = user.items.length; i >= 0; i--) {
        user.items.remove(user.items[i])
    }
    await user.save()
    res.send({ success: true, bag: [] })
})


export default router;
