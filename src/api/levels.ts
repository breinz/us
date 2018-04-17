import * as express from "express"
import Levels from "../levels/model"

var router = express.Router()

router.get("/", (req, res, next) => {
    Levels.find((err, levels) => {
        if (err) next(err)
        res.send({levels: levels})
    })
})

export default router;
