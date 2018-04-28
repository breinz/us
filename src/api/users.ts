import * as express from "express"
import { User } from "../user/model"

var router = express.Router()

/**
 * Users list
 */
router.get('/', (req, res, next) => {
    User.find((err, users) => {
        if (err) next(err)
        res.send({users: users })  
    })
})

/**
 * One user
 */
router.get('/:userId', (req, res, next) => {
    User.findById(req.params.userId/*, ['_id', "login"]*/,(err, user) => {
        if (err) next(err)
        res.send(user)
    })
})

export default router;
