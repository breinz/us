import * as express from "express"
import { Building, BuildingModel } from "../building/model";
import { Cell, CellModel, CellBuildingModel } from "../cell/model";
import { UserModel } from "../user/model";

var router = express.Router()

// **************************************************
// Weel
// **************************************************

/**
 * POST /api/actions/getWater
 * @param @id The weel id
 */
router.post("/getWater", async (req, res, next) => {
    const user = <UserModel>req.user
    try {
        let cell:CellModel = <CellModel>await Cell.findById(user.currentCell)

        let weel:CellBuildingModel = await cell.buildings.id(req.body.weelId)
        weel.rations--
        await cell.save();
        res.send({success: true, rations: weel.rations})
    } catch (err) {
        res.send({error: err})
    }
})

export default router;
