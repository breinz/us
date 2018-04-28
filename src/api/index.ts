import * as express from "express"
import User from "../user/model"
import goals from './goals'
import users from "./users"

const router = express.Router()

// goals
router.use("/goals", goals)
router.use("/users", users)

router.get('/', (req, res) => {
    res.send({ data: [] })
})

export default router