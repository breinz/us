import * as express from "express"
import * as mongoose from "mongoose";
//import { Level } from "../level/model";
import { Level, LevelModel } from "../level/model";

let router = express.Router()

/**
 * GET /admin/levels
 */
/*router.get("/", (req, res, next) => {
    Goal.find((err, docs) => {
        const bc = [
            "Goals"
        ]
        res.render("admin/goals/index", {
            bc: bc,
            goals: docs
        })
    }).sort("level")
})*/

/**
 * GET /admin/goals/new
 */
router.get("/new", (req, res) => {
    res.render("admin/levels/new")
})

/**
 * POST /admin/goals/new
 */
router.post("/new", (req, res, next) => {
    var level = new Level({
        color: req.body.color,
        innerDist: req.body.innerDist,
        outerDist: req.body.outerDist,
        level: req.body.level
    })

    level.save(err => {
        if (err) next(err)
        res.redirect("/admin/goals")
    })
})

/**
 * GET /admin/levels/:levelId/edit
 * @param levelId
 */
router.get("/:levelId/edit", (req, res, next) => {
    Level.findById(req.params.levelId, (err, level) => {
        if (err) next(err)
        res.render("admin/levels/edit", {
            level: level
        })
    })
})

router.post("/:levelId/edit", (req, res, next) => {
    Level.findByIdAndUpdate(req.params.levelId, {
        color: req.body.color,
        innerDist: req.body.innerDist,
        outerDist: req.body.outerDist,
        level: req.body.level
    }, (err, level) => {
        if (err) next(err)
        res.redirect("/admin/goals")
    })
})
/**
 * GET /admin/goals/:goalId/delete
 * @param goalId
 */
/*router.get("/:goalId/delete", (req, res, next) => {
    Goal.findByIdAndRemove(req.params.goalId, (err, doc) => {
        if (err) next(err)
        res.redirect("/admin/goals")
    })
})*/

export default router