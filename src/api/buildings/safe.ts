import * as express from "express"
import { Cell, CellModel, CellBuildingModel, CellBuilding, CellItemModel, CellItem } from "../../back/cell/model";
import { Item, ItemModel } from "../../back/item/model";
import { shuffle, D2R } from "../../helper";
import { ITEMS } from "../../const";
import { Us } from "../../us";

let router = express.Router()

/**
 * Open the safe
 */
router.post("/open", async (req, res) => {
    let ret: Us.Safe.ApiResult.Open = { success: false, by: req.user.id };
    let params: Us.Safe.ApiParams.Open = req.body;

    try {
        const cell = await Cell.findById(req.user.currentCell).populate("buildings.building") as CellModel;

        const safe = cell.buildings.id(params.safeId) as CellBuildingModel;

        const now = Date.now()

        // Safe already open
        if (safe.isOpen(ITEMS.SAFE.REFILL_DELAY)) {
            ret.error = "buildings.safe.open.already";
            res.send(ret)
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
        let cellItem = new CellItem({ item: items[0] }) as CellItemModel;

        const direction = Math.random() * 360 * D2R;
        cellItem.x = Math.round(params.pos.x + Math.cos(direction) * ITEMS.SAFE.THROW_AT);
        cellItem.y = Math.round(params.pos.y + Math.sin(direction) * ITEMS.SAFE.THROW_AT);

        if (cellItem.item.name === "pistol") {
            cellItem.ammo = Math.ceil(Math.random() * 6);
        }

        cell.items.push(cellItem);

        await cell.save();

        ret.success = true;
        ret.cellItem = cellItem;//items[0]
        ret.now = now;
        ret.direction = direction;
        res.send(ret);
    } catch (err) {
        ret.fatal = err.message;
        res.send(ret)
    }
})

export default router