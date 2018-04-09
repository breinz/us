import * as express from "express"
import User from "../user/model"

const router = express.Router()

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