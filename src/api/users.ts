import * as express from "express"
import { User } from "../back/user/model"
import { UserModel } from "../back/user/model";

var router = express.Router()

/**
 * Users list
 */
router.get('/', (req, res, next) => {
    User.find((err, users) => {
        if (err) next(err)
        res.send({ users: users })
    }).populate("items.bag.item")
})

/**
 * The current user (logged in)
 */
router.get("/me", (req, res, next) => {
    User.findById(req.user.id, (err, user) => {
        if (err) next(err)
        res.send({ user: user })
    }).populate("items.bag.item")
        .populate("items.equipped.item")
})

/**
 * One user
 * @param req.params.userId User id
 */
router.get('/:userId', (req, res, next) => {
    User.findById(req.params.userId/*, ['_id', "login"]*/, (err, user) => {
        if (err) next(err)
        res.send(user)
    })
})

/**
 * Current user uses one (or more) pa
 * @param req.body.count The number of pas used
 */
router.post("/usePA", async (req, res) => {
    let user: UserModel = await User.findById(req.user.id) as UserModel

    user.pa -= req.body.count

    await user.save()

    res.send({ success: true });
})

/**
 * Update the pa number 
 * @param req.body.count The new pa number 
 */
router.post("/updatePA", async (req, res) => {
    const user = req.user as UserModel;
    user.pa = req.body.count
    await user.save()
    res.send({ success: true })
})

export default router;
