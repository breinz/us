import * as express from "express"
import { User, UserModel } from "../back/user/model";
import { Item, ItemModel } from "../back/item/model";
import { CellModel, CellBuildingModel, Cell } from "../back/cell/model";

const router = express.Router()

/**
 * POST /api/actions/getWater
 * @param wellId The well id
 */
router.post("/getWater", async (req, res, next) => {
    try {
        //const user = req.user as UserModel

        const user = await User.findById(req.user.id).populate("items.item") as UserModel

        // Find the item bottle
        let bottle_empty_id = (await Item.findOne({ name: "bottle" }, ["_id"]) as ItemModel).id

        // Find the bottle in bag
        let user_bottle = user.items.find(user_item => {
            return user_item.item.equals(bottle_empty_id);
        })
        if (!user_bottle) {
            return res.send({ error: "no_bottle" });
        }

        let cell: CellModel;
        let well: CellBuildingModel;

        // Find the well
        cell = <CellModel>await Cell.findById(user.currentCell)
        well = await cell.buildings.id(req.body.wellId)

        // Check if the well has enough water left
        if (well.rations <= 0) return res.send({ error: "well_empty" })

        // Check if the well has been poisoned
        let poison = false;
        if (well.poison && well.poison > 0) {
            if (Math.random() > .5) {
                well.poison--;
                poison = true;
            }
        }

        // Remove one ration from the well
        well.rations--
        await cell.save()

        // Remove the bottle from the user
        user.items.remove(user_bottle);

        // Add the bottle_full to the user
        let bottle_full: ItemModel = await Item.findOne({ name: "bottle_full" }) as ItemModel;
        user.items.push({ item: bottle_full, poisoned: poison })

        await user.save()

        // Send back the data needed to update 
        res.send({
            success: true,
            wellId: req.body.wellId,
            rations: well.rations,
            poison: well.poison,
            bag: user.items
        })
    } catch (err) {
        res.send({ fatal: err.message });
        throw err;
    }
})

/**
 * Add water to a well
 */
router.post("/addWater", async (req, res, next) => {
    try {
        //const user = req.user as UserModel
        const user = await User.findById(req.user.id).populate("items.item") as UserModel

        // Find the item bottle
        let bottle: ItemModel = await Item.findOne({ name: "bottle" }) as ItemModel

        // Find the full bottle
        let bottle_full: ItemModel = await Item.findOne({ name: "bottle_full" }) as ItemModel;

        let cell: CellModel;
        let well: CellBuildingModel;

        // Find the well
        cell = <CellModel>await Cell.findById(user.currentCell)
        well = await cell.buildings.id(req.body.wellId)

        // Check if the user has a full bottle
        let user_bottle = user.items.find(item => {
            return item.item.equals(bottle_full._id)
        })
        if (!user_bottle) {
            return res.send({ error: "well.add_water.no_bottle" })
        }

        // Add one ration from the well
        well.rations++
        await cell.save()

        // Add the empty bottle to the user
        user.items.push({ item: bottle })

        // Remove the full bottle from the user
        user.items.remove(user_bottle)

        await user.save()

        // Send back the data needed to update 
        res.send({
            success: true,
            wellId: req.body.wellId,
            rations: well.rations,
            bag: user.items
        })
    } catch (err) {
        res.send({ fatal: err.message });
    }
})

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