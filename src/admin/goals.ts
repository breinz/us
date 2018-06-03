import * as express from "express"
import * as mongoose from "mongoose";
import { Goal, GoalModel } from "../back/goal/model";
import { Level, LevelModel } from "../back/level/model";

let router = express.Router()

/**
 * GET /admin/levels
 */
router.get("/", (req, res, next) => {
    Promise.all([
        Level.find().sort("level"),
        Goal.find()
    ]).then(docs => {
        const bc = [
            "Goals"
        ]
        res.render("admin/goals/index", {
            bc: bc,
            levels: docs[0],
            goals: docs[1]
        })
    }).catch(err => {
        next(err)
    })
})

/**
 * GET /admin/goals/new
 */
router.get("/new", (req, res) => {
    Level.find((err, levels) => {
        res.render("admin/goals/new", {
            levels: levels
        })
    }).sort("level")
})

/**
 * POST /admin/goals/new
 * @param phrase body
 * @param level body
 */
router.post("/new", (req, res, next) => {
    Level.findById(req.body.level, (err, level) => {
        if (err) next(err)

        var goal = new Goal({
            phrase: req.body.phrase,
            level: level
        })
    
        goal.save(err => {
            if (err) next(err)
            res.redirect("/admin/goals")
        })
    })
})

/**
 * GET /admin/:goalId/edit
 * @param goalId
 */
router.get("/:goalId/edit", (req, res, next) => {
    Promise.all([
        Goal.findById(req.params.goalId),
        Level.find().sort("level")
    ]).then(([goal, levels]:[GoalModel, Array<LevelModel>]) => {
        if (!goal) next(new Error("Goal not found"))
        res.render("admin/goals/edit", {
            goal: goal,
            levels: levels,
            bc: [
                ["Goals", "/goals"],
                [goal.phrase, `/goals/${goal.id}`],
                "Edit"
            ]
        })
    }).catch(err => {
        next (err)
    })
})

/**
 * POST /admin/:goalId/edit
 * @param goalId
 */
router.post("/:goalId/edit", (req, res, next) => {
    Goal.findByIdAndUpdate(req.params.goalId, {
        phrase: req.body.phrase,
        level: req.body.level
    }, (err, doc) => {
        if (err) next(err)
        res.redirect("/admin/goals")
    })
})

/**
 * GET /admin/goals/:goalId/delete
 * @param goalId
 */
router.get("/:goalId/delete", (req, res, next) => {
    Goal.findByIdAndRemove(req.params.goalId, (err, doc) => {
        if (err) next(err)
        res.redirect("/admin/goals")
    })
})

export default router