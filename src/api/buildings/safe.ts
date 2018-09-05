import * as express from "express"
import { Cell, CellModel, CellBuildingModel, CellBuilding } from "../../back/cell/model";
import { Item, ItemModel } from "../../back/item/model";
import { shuffle } from "../../helper";
import { ITEMS } from "../../const";

let router = express.Router()

router.post("/open", async (req, res) => {
    try {
        const cell = await Cell.findById(req.user.currentCell).populate("buildings.building") as CellModel;

        const safe = cell.buildings.id(req.body.safeId) as CellBuildingModel;


        console.log(safe.isOpen(ITEMS.SAFE.REFILL_DELAY) ? "open" : "close");
        // Safe already open
        if (safe.isOpen(ITEMS.SAFE.REFILL_DELAY)) {
            res.send({ success: false, error: "buildings.safe.open.already" })
            return;
        }

        safe.visited.push({
            by: req.user.id,
            at: Date.now()

        });

        await cell.save();

        // Find an item to get out
        let items = await Item.find({ in_safe: true }) as ItemModel[]
        items = shuffle(items) as ItemModel[];

        /*const user = await User.findById(req.user._id).populate("items.bag.item") as UserModel
     
        if (!user.hasItem("string", 5)) {
            return res.send({ error: "items.string.assemble.not_enough" })
        }
     
        // Remove 5 strings
        let count = 0
        for (let i = user.items.bag.length - 1; i >= 0; i--) {
            const string = user.items.bag[i]
            if (string.item.name === "string") {
                user.items.bag.remove(string)
                if (++count >= 5) break;
            }
        }
     
        // Add a rope
        const rope = <ItemModel>await Item.findOne({ name: "rope" })
        console.log(rope);
     
        user.items.bag.push({ item: rope })
     
        await user.save()*/

        res.send({ success: true, item: items[0] });
    } catch (err) {
        res.send({ fatal: err.message })
    }
})

export default router