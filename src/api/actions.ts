import * as express from "express"
import { Building, BuildingModel } from "../back/building/model";
import { Cell, CellModel, CellBuildingModel } from "../back/cell/model";
import { UserModel, UserItemModel, User } from "../back/user/model";
import { Item, ItemModel } from "../back/item/model";
import dig from "./dig"

var router = express.Router()

router.use("/dig", dig)

// **************************************************
// Well
// **************************************************

/*
Find empty bottle
 In bag
  not found => error
  Find the well
  has 0 rations => error
  remove 1 ration
Find full bottle
add full bottle in bag
remove empty bottle in bag
*/
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

        // Remove one ration from the well
        well.rations--
        await cell.save()

        // Remove the bottle from the user
        user.items.remove(user_bottle);

        // Add the bottle_full to the user
        let bottle_full: ItemModel = await Item.findOne({ name: "bottle_full" }) as ItemModel;
        user.items.push({ item: bottle_full })

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

// **************************************************
// Dig
// **************************************************

/**
 * Grab an item
 * @todo put into ./dig
 * @param from string Where from is that item grabbed
 * @param item ItemModel The Item
 */
router.post("/grabItem", async (req, res) => {
    try {
        // Get the user
        const user = await User.findById(req.user._id).populate("items.item") as UserModel

        // Get the item
        const item = req.body.item as ItemModel;

        // Create the UserItemModel
        let push = { item: item } as UserItemModel

        // If the item is a pistol, give some ammos
        if (item.name === "pistol") {
            push.ammo = Math.ceil(Math.random() * 6)
        }

        // Add the item to the bag
        user.items.push(push)

        // Save
        await user.save()

        res.send({ success: true, bag: user.items })
    } catch (err) {
        res.send({ fatal: err.message });
    }
})

// **************************************************
// Items
// **************************************************

router.post("/drink", async (req, res) => {
    try {
        // Find the user
        const user = await User.findById(req.user._id).populate("items.item") as UserModel

        // Find the user's bottle
        const item = user.items.id(req.body.item._id) as UserItemModel

        if (item === null) {
            return res.send({ error: "drink.no_water" })
        }

        // Find the item bottle
        let bottle = await Item.findOne({ name: "bottle" }) as ItemModel

        // Remove the full bottle
        user.items.remove(item)

        // Add the empty bottle
        user.items.push({ item: bottle })

        // Get to 6 pa
        user.pa = Math.max(user.pa, 6);

        await user.save();

        res.send({ success: true, bag: user.items })
    } catch (err) {
        res.send({ fatal: err.message });
    }
})

/*
Find user
Find pistol in bag
 not found => error
 fully loaded => error
Find ammo
Find the ammo in bag
 not found => error
Add ammo to pistol
Remove ammo from bag
 */

/**  
*/
router.post("/reload", async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("items.item") as UserModel

        if (user.pa < 1) {
            return res.send({ error: "not_enough_pa" })
        }

        // Find the gun
        const user_pistol = user.items.id(req.body.user_pistol_id) as UserItemModel

        // No pistol
        if (user_pistol === null) {
            return res.send({ error: "items.not_in_bag" })
        }

        // Pistol fully loaded => error
        if (user_pistol.ammo >= 6) {
            return res.send({ error: "items.pistol.reload.full" })
        }

        // Find item ammo
        const ammo = await Item.findOne({ name: "ammo" }) as ItemModel

        // Find the ammo in the bag
        const user_ammo = user.items.find(element => {
            return element.item.equals(ammo._id)
        })

        // No ammo in the bag => error
        if (user_ammo === undefined) {
            return res.send({ error: "items.pistol.reload.no_ammo" })
        }

        // Add one ammo to the pistol
        user_pistol.ammo++;

        // Remove one ammo from bag
        user.items.remove(user_ammo)

        await user.save()

        res.send({ success: true, ammo: user_pistol.ammo, bag: user.items })
    } catch (err) {
        res.send({ fatal: true, error: err.message })
    }
})

/**
 * Rest
 * @param req.body.pa How many pa you had when going to rest
 * @param req.body.at At what time you went to rest
 * @param req.body.speed The quality of the rest
 */
router.post("/rest", async (req, res) => {
    const user = req.user as UserModel;

    user.rest = {
        at: Date.now(),
        pa: req.body.pa,
        speed: req.body.speed
    }

    await user.save()

    res.send({ success: true })
})

router.post("/wakeup", async (req, res) => {
    const user = req.user as UserModel;

    if (!user.rest) {
        return res.send({ error: "not_asleep" });
    }

    const add = Math.floor(((Date.now() - user.rest.at) / 1000) / user.rest.speed);

    user.pa = Math.min(1000, user.pa + add)

    user.rest = null

    await user.save()

    return res.send({ success: true, pa: user.pa })
})

/**
 * The user moved
 * @param req.body.x Position x
 * @param req.body.y Position y
 */
router.post("/move", async (req, res) => {
    const user = req.user as UserModel;

    user.x = req.body.x;
    user.y = req.body.y;

    await user.save()

    return res.send({ success: true });
})

export default router;
