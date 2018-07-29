import * as express from "express"
import * as mongoose from "mongoose";

let router = express.Router()

/**
 * GET /admin/levels
 */
router.get("/", (req, res, next) => {
    res.render("admin/grid/index")
})

export default router