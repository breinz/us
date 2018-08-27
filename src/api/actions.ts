import * as express from "express"
import { Building, BuildingModel } from "../back/building/model";
import { Cell, CellModel, CellBuildingModel } from "../back/cell/model";
import { UserModel, UserItemModel, User } from "../back/user/model";
import { Item, ItemModel } from "../back/item/model";
import dig from "./dig"
import well from "./well"
import die from "./die";
import items from "./items"
import buildings from "./buildings"

var router = express.Router()

router.use("/dig", dig)
router.use("/well", well)
router.use("/items", items)
router.use("/buildings", buildings)


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
        const user = await User.findById(req.user._id).populate("items.bag.item") as UserModel

        // Get the item
        const item = req.body.item as ItemModel;

        // Create the UserItemModel
        let push = { item: item } as UserItemModel

        // If the item is a pistol, give some ammos
        if (item.name === "pistol") {
            push.ammo = Math.ceil(Math.random() * 6)
        }

        // Add the item to the bag
        user.items.bag.push(push)

        // Save
        await user.save()

        res.send({ success: true, bag: user.items.bag })
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
        const user = await User.findById(req.user._id).populate("items.bag.item") as UserModel

        // Find the user's bottle
        const item = user.items.bag.id(req.body.item._id) as UserItemModel

        if (item === null) {
            return res.send({ error: "drink.no_water" })
        }

        // Did the user already drink today
        if (user.drank_at !== undefined && (new Date(user.drank_at)).getDate() === (new Date()).getDate()) {
            return res.send({ error: "drink.already_today" })
        }

        // Is the water poisoned
        if (item.poisoned === true) {
            die(req, "poison");
            res.send({ dead: true });
            return;
        }

        // Find the item bottle
        let bottle = await Item.findOne({ name: "bottle" }) as ItemModel

        // Remove the full bottle
        user.items.bag.remove(item)

        // Add the empty bottle
        user.items.bag.push({ item: bottle })

        // Get to 200 pa
        user.pa = user.pa + 200;
        if (user.pa > 1000) {
            user.pa = 1000;
        }

        // Save when the user drank
        user.drank_at = Date.now()

        await user.save();

        res.send({ success: true, bag: user.items.bag, pa: user.pa })
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
        const user = await User.findById(req.user._id).populate("items.bag.item") as UserModel

        if (user.pa < 1) {
            return res.send({ error: "not_enough_pa" })
        }

        // Find the gun
        const user_pistol = user.items.bag.id(req.body.user_pistol_id) as UserItemModel

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
        const user_ammo = user.items.bag.find(element => {
            return element.item.equals(ammo._id)
        })

        // No ammo in the bag => error
        if (user_ammo === undefined) {
            return res.send({ error: "items.pistol.reload.no_ammo" })
        }

        // Add one ammo to the pistol
        user_pistol.ammo++;

        // Remove one ammo from bag
        user.items.bag.remove(user_ammo)

        await user.save()

        res.send({ success: true, ammo: user_pistol.ammo, bag: user.items.bag })
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

router.post("/switchMode", async (req, res) => {
    const user = req.user as UserModel;

    user.mode = req.body.mode;

    await user.save()

    return res.send({ success: true });
})

export default router;
