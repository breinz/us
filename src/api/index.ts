import * as express from "express"
import User from "../user/model"
import levels from "./levels"

const router = express.Router()

// Levels
router.use('/levels', levels)

router.get('/', (req, res) => {
    res.send({ data: [] })
})

// --------------------------------------------------
// Users
// --------------------------------------------------

/**
 * Users list
 */
router.get('/users', (req, res, next) => {
    User.find((err, users) => {
        if (err) next(err)
        res.send({users: users })  
    })
})

/**
 * One user
 */
router.get('/users/:userId', (req, res, next) => {
    User.findById(req.params.userId/*, ['_id', "login"]*/,(err, user) => {
        if (err) next(err)
        res.send(user)
    })
})

export default router