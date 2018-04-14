import * as express from "express"
import user from "./users"

const router = express.Router()

/**
 * User has to be logged in as an admin
 */
router.use((req, res, next) => {

    // Logged in
    if (!req.isAuthenticated()) {
        return res.redirect("/")
    }

    // Admin
    if (req.user.admin !== true) {
        return res.redirect("/")
    }
    next()
})

router.use(user);

/**
 * Get /admin
 * Admin index
 */
router.get('/', (req, res) => {
    res.render("admin/index")
})


export default router