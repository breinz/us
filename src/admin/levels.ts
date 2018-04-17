import * as express from "express"
import Level, { Goal, LevelModel, GoalModel } from "../levels/model"
import * as mongoose from "mongoose";

let router = express.Router()

/**
 * GET /admin/levels
 */
router.get("/", (req, res, next) => {
    Level.find((err, docs) => {
        const bc = [
            "Levels"
        ]
        res.render("admin/levels/index", {
            bc: bc,
            levels: docs
        })
    })
})

/**
 * GET /admin/levels/new
 * Create a new level
 */
router.get("/new", (req, res, next) => {
    // Find the highest level
    Level.findOne(null, 'level', {sort: {level: -1}}, (err, doc:LevelModel) => {
        let new_level = doc ? doc.level+1 : 0;

        console.log(new_level);

        // Create a new level above that one
        var level = new Level({level: new_level})
        level.save(err => {
            console.log(err);
            if (err) next(err)
            res.redirect('/admin/levels')
        })
    })  
})

/**
 * GET /admin/levels/:levelId/delete
 * @param levelId Level id
 * Delete a level
 */
router.get("/:levelId/delete", (req, res, next) => {
    Level.findByIdAndRemove(req.params.levelId, err => {
        if (err) next(err)
        res.redirect("/admin/levels")
    })
})

/**
 * GET /admin/levels/:levelId/add-goal?value=:goal
 * @param levelId In which level to add the goal
 * @param goal The goal description
 */
router.get("/:levelId/add-goal", (req, res, next) => {
    Level.findById(req.params.levelId, (err, doc:LevelModel) => {
        if (err) next(err)
        //var goal = new Goal({ phrase: req.query.value })
        doc.goals.push(<GoalModel>{ phrase: req.query.value })
        doc.save(err => {
            if (err) next(err)
            res.redirect("/admin/levels")
        })
    })
})

/**
 * GET /admin/levels/:levelId/goals/:goalId/delete
 * @param levelId Level id
 * @param goalId Goal id
 * Delete a goal
 */
router.get("/:levelId/goals/:goalId/delete", (req, res, next) => {
    Level.findById(req.params.levelId, (err, level:LevelModel) => {
        if (err) next(err)
        
        level.goals.id(req.params.goalId).remove()

        level.save(err => {
            if (err) next(err)
            res.redirect("/admin/levels")
        })
        /*for (let index = 0; index < level.goals.length; index++) {
            const element:GoalModel = level.goals[index];
            if (element.id === req.params.goalId)
                element.remove(err => {
                    if (err) next(err)
                    level.save(err => {
                        if (err) next(err)
                        res.redirect("/admin/levels")
                    })
                })
                break;
        }*/
    })
})

export default router