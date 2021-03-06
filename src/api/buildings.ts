import * as express from "express"
import { Cell, CellModel, CellBuildingModel } from "../back/cell/model";
import safe from "./buildings/safe";
import { UserModel } from "../back/user/model";

const router = express.Router()

router.use("/safe", safe)

/**
 * Enter a building
 * Register that in cell.buildings.building.visited
 * @param building req.body.building
 */
router.post("/enter", async (req, res, next) => {
    try {
        const user = req.user as UserModel

        const cell = await Cell.findById(user.currentCell).populate("buildings") as CellModel

        const cell_building = await cell.buildings.id(req.body.building) as CellBuildingModel

        cell_building.visited.push({
            by: user.id,
            at: Date.now()
        });

        await cell.save();

        res.send({ success: true })
    } catch (err) {
        res.send({ fatal: err.message })
    }
})

export default router;