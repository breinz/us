import * as express from "express"
import { Building, BuildingModel } from "../back/building/model";
import { Cell, CellModel, CellBuildingModel } from "../back/cell/model";
import { UserModel } from "../back/user/model";
import { Item, ItemModel } from "../back/item/model";
import dig from "./dig"

var router = express.Router()

router.use("/dig", dig)

// **************************************************
// Weel
// **************************************************

/**
 * POST /api/actions/getWater
 * @param weelId The well id
 */
router.post("/getWater", async (req, res, next) => {
    const user = req.user as UserModel

    // Find the item bottle
    let item: ItemModel;
    try {
        item = await Item.findOne({name: "bottle"}) as ItemModel
    } catch (err) {
        return res.send({error: "Item doesn't exist error" + err})
    }
    if (item === null) {
        return res.send({error: "Item doesn't exist"})
    }

    /*// Check if user doesn't have water already
    if (user.hasItem(item)) {
        return res.send({error: "has_already"})
    }*/

    let cell: CellModel;
    let well: CellBuildingModel;

    // Find the well
    try {
        cell = <CellModel>await Cell.findById(user.currentCell)
        
        well = await cell.buildings.id(req.body.wellId)
    } catch (err) {
        return res.send({error: err})
    }
    
    // Check if the well has enough water left
    if (well.rations <= 0) {
        return res.send({error: "empty"})
    }

    // Remove one ration from the well
    well.rations--
    await cell.save()
        .catch(err => next(err));

    // Add the item to the user
    user.items.push({item: item.id})
    await user.save()
        .catch(err => next(err))
    

    // Send back the data needed to update 
    res.send({success: true, wellId: req.body.wellId, rations: well.rations})
})

/**
 * Dig
 * @todo put into ./dig
 */
router.post("/dig", async (req, res, next) => {
    const user = req.user as UserModel

    user.dig_count++;

    await user.save()

    res.send({dig_count: user.dig_count})
})

/**
 * Grab an item
 * @todo put into ./dig
 * @param from string Where from is that item grabbed
 * @param item ItemModel The Item
 */
router.post("/grabItem", async (req, res) => {
    const user = req.user as UserModel

    user.items.push({item: req.body.item})

    await user.save()

    res.send({success: true})
})

export default router;
