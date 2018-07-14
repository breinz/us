import * as express from "express"
import { User, UserModel } from "../back/user/model";
import { Item, ItemModel } from "../back/item/model";
import { CellModel, CellBuildingModel, Cell } from "../back/cell/model";

const router = express.Router()

/**
 * Poison
 */
router.post("/poison", async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("items.item") as UserModel

        // Find the item poison
        let poison_id = (await Item.findOne({ name: "poison" }, ["_id"]) as ItemModel).id

        // Find the poison in bag
        let user_poison = user.items.find(user_item => {
            return user_item.item.equals(poison_id);
        })
        if (!user_poison) {
            return res.send({ error: "well.poison.no_poison" });
        }

        // Find the well
        let cell = <CellModel>await Cell.findById(user.currentCell)
        let well = <CellBuildingModel>await cell.buildings.id(req.body.wellId)

        well.poison++
        await cell.save()

        // Remove the poison from the user
        user.items.remove(user_poison);

        await user.save()

        // Send back the data needed to update 
        res.send({
            success: true,
            wellId: req.body.wellId,
            poison: well.poison,
            bag: user.items
        })
    } catch (err) {
        res.send({ fatal: err.message });
        throw err;
    }
})

export default router;