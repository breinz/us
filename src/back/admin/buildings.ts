import * as express from "express"
import * as mongoose from "mongoose";
import { Building, BuildingModel } from "../building/model";

let router = express.Router()

/**
 * GET /admin/levels
 */
router.get("/", (req, res, next) => {
    Building.find()
        .then((buildings: BuildingModel[]) => {
            res.render("admin/buildings/index", {
                buildings: buildings
            })
        })
        .catch(err => {
            next(err)
        })
})

/**
 * GET /admin/buildings/new
 */
router.get("/new", (req, res) => {
    res.render("admin/buildings/new")
})

/**
 * POST /admin/buildings/new
 * Create a new building
 * @param name req.body Building's name
 */
router.post("/new", async (req, res, next) => {
    let building = new Building({
        name: req.body.name
    })

    try {
        await building.save();
    } catch (err) {
        next(err)
    }

    res.redirect("/admin/buildings")
})

/**
 * Get /admin/buildings/:buildingId/edit
 * Edit form
 * @param buildingId
 */
router.get("/:buildingId/edit", async (req, res, next) => {
    let building;
    try {
        building = await Building.findById(req.params.buildingId)
    } catch (err) {
        next(err)
    }

    if (!building) next(new Error("no building"))

    res.render("admin/buildings/edit", {
        building: building
    })
})

/**
 * POST /admin/buildings/:buildingId/edit
 * Edit
 * @param buildingId req.params
 * @param name req.body
 */
router.post("/:buildingId/edit", async (req, res, next) => {
    try {
        let building: BuildingModel = <BuildingModel>await Building.findById(req.params.buildingId)

        building.name = req.body.name
        building.offset = {
            top: req.body.offset_t,
            left: req.body.offset_l,
            right: req.body.offset_r,
            bottom: req.body.offset_b
        }
        building.hitArea = {
            x: req.body.hitArea_x,
            y: req.body.hitArea_y,
            width: req.body.hitArea_w,
            height: req.body.hitArea_h,
        }

        await building.save()
    } catch (err) {
        next(err)
    }

    res.redirect("/admin/buildings");
})

export default router