import * as express from "express"
import { Cell, CellModel, CellBuildingModel, CellBuilding } from "../../back/cell/model";
import { Item, ItemModel } from "../../back/item/model";
import { shuffle } from "../../helper";
import { ITEMS } from "../../const";

let router = express.Router()

/**
 * Open the safe
 */
router.post("/open", async (req, res) => {
    try {
        const cell = await Cell.findById(req.user.currentCell).populate("buildings.building") as CellModel;

        const safe = cell.buildings.id(req.body.safeId) as CellBuildingModel;

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

        res.send({ success: true, item: items[0] });
    } catch (err) {
        res.send({ fatal: err.message })
    }
})

export default router