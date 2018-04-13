import * as express from "express";
import User, { UserModel } from "../user/model";

var router = express.Router();

/**
 * GET /admin/users
 * Users index
 */
router.get('/users', (req, res, next) => {
    User.find((err, users) => {
        if (err) next(err)

        const bc = ["Users"];

        res.render("admin/users", {
            users: users,
            bc: bc
        })
    })
})

/**
 * GET /admin/users/:userId
 * @param userId User id
 * One user
 */
router.get('/users/:userId', (req, res, next) => {
    User.findById(req.params.userId, (err, user:UserModel) => {
        if (err) next(err)

        const bc = [
            ["Users", "/users"],
            user.login
        ]

        res.render("admin/user", {
            user: user,
            bc: bc
        })
    })
})

/**
 * GET /users/:userId/edit
 * @param userId User id
 * Edit form
 */
router.get("/users/:userId/edit", (req, res, next) => {
    User.findById(req.params.userId, (err, user:UserModel) => {
        if (err) next(err)
        let bc = [
            ["Users", "/admin/users"],
            [user.login, `/admin/users/${user.id}`],
            "Edit"
        ]
        res.render("admin/users/edit", {
            bc: bc
        })
    })
})

/**
 * GET /admin/users/:userId/delete
 * @param userId User id
 * Delete an user
 */
router.get('/users/:userId/delete', (req, res, next) => {
    User.findByIdAndRemove(req.params.userId, (err, doc) => {
        if (err) next(err)
        res.redirect("/admin/users")
    })
})

export default router