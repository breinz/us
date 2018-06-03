import * as express from "express"
import { Goal, GoalModel } from "../back/goal/model";

var router = express.Router()

router.get("/", (req, res, next) => {
    Goal.find((err, goals) => {
        if (err) next(err)
        res.send({
            goals: goals
        })
    }).sort("level")
})

export default router;
