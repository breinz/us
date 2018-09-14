import * as express from "express"
import { Cell, CellModel, CellBuildingModel, CellBuilding, CellItemModel } from "../../back/cell/model";
import { Item, ItemModel } from "../../back/item/model";
import { shuffle, D2R } from "../../helper";
import { ITEMS } from "../../const";
import { Us } from "../../us";

let router = express.Router()

/**
 * Open the safe
 */
router.post("/open", async (req, res) => {
    let send: Us.Safe.ApiResult.Open = { success: false, by: req.user.id };

    try {
        const cell = await Cell.findById(req.user.currentCell).populate("buildings.building") as CellModel;

        const safe = cell.buildings.id(req.body.safeId) as CellBuildingModel;

        const now = Date.now()

        // Safe already open
        if (safe.isOpen(ITEMS.SAFE.REFILL_DELAY)) {
            send.error = "buildings.safe.open.already";
            res.send(send)
            return;
        }

        safe.visited.push({
            by: req.user.id,
            at: now

        });



        // Find an item to get out
        let items = await Item.find({ in_safe: true }) as ItemModel[]
        items = shuffle(items) as ItemModel[];

        // Add the item to the cell
        let cellItem = { item: items[0] } as CellItemModel;

        const direction = Math.random() * 360 * D2R;
        cellItem.x = safe.x + Math.cos(direction) * ITEMS.SAFE.THROW_AT;
        cellItem.y = safe.y + Math.sin(direction) * ITEMS.SAFE.THROW_AT;

        if (cellItem.item.name === "pistol") {
            cellItem.ammo = Math.ceil(Math.random() * 6);
        }

        cell.items.push(cellItem);

        await cell.save();

        cellItem._id = "" + Math.random();

        send.success = true;
        send.cellItem = cellItem;//items[0]
        send.now = now;
        send.direction = direction;
        res.send(send);
    } catch (err) {
        send.fatal = err.message;
        res.send(send)
    }
})

export default router