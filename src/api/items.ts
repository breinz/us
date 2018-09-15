import * as express from "express"
import string from "./items/string"
import safe from "./buildings/safe"
import { User, UserModel } from "../back/user/model";
import { Us } from "../us";
import { Cell, CellModel, CellItemModel } from "../back/cell/model";

let router = express.Router()

router.use("/string", string)
router.use("/safe", safe)

/**
 * Grab a cellItem
 */
router.post("/grab", async (req, res) => {
    let ret: Us.Items.ApiResult.grab = { success: false };

    try {
        let user = await User.findById(req.user.id).populate("items.bag.item") as UserModel;

        const cell = await Cell.findById(user.currentCell) as CellModel;

        // The bagItem to equip
        const cellItem = cell.items.id(req.body.cellItem_id) as CellItemModel

        /** @todo Check if the bag is full */

        /** @todo Check if the bag is full of heavy items */

        // add The item to the bag
        user.items.bag.push(cellItem);

        // Remove the item from the cell
        cell.items.remove(cellItem);

        await cell.save()
        await user.save()

        // Have to refetch the user to populate the last inserted item
        user = await User.findById(req.user.id).populate("items.bag.item") as UserModel;

        ret.success = true;
        ret.bag = user.items.bag;
        res.send(ret);

    } catch (error) {
        ret.fatal = error.message;
        res.send(ret);
    }
});

/**
 * Equip an item
 * @param bagItem_id
 */
router.post("/equip", async (req, res) => {
    let ret: Us.Items.ApiResult.equip = { success: false, items: null };

    try {
        const user = await
            User.findById(req.user.id)
                .populate("items.bag.item")
                .populate("items.equipped.item") as UserModel;

        // The bagItem to equip
        const item = user.items.bag.id(req.body.bagItem_id)

        user.items.equipped.push(item)

        user.items.bag.remove(item);

        await user.save();

        ret.success = true;
        ret.items = user.items;
        res.send(ret);

    } catch (err) {
        ret.fatal = err.message;
        res.send(ret);
    }
})

/**
 * Unequip an item
 * @param item_id
 */
router.post("/unequip", async (req, res) => {
    const user = await
        User.findById(req.user.id)
            .populate("items.bag.item")
            .populate("items.equipped.item") as UserModel;

    const item = user.items.equipped.id(req.body.item_id)

    user.items.equipped.remove(item)

    user.items.bag.push(item)

    await user.save()

    res.send({ success: true, items: user.items })
})

export default router;
