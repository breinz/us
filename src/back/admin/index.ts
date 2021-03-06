import * as express from "express"
import user from "./users"
import goals from "./goals"
import levels from "./levels"
import buildings from "./buildings"
import items from "./items"
import grid from "./grid"
import quests from "./quests"
import maps from "./maps"

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
router.use("/goals", goals);
router.use("/levels", levels)
router.use("/buildings", buildings)
router.use("/items", items)
router.use("/grid", grid)
router.use("/quests", quests)
router.use("/maps", maps)

/**
 * Get /admin
 * Admin index
 */
router.get('/', (req, res) => {
    res.render("admin/index")
})


export default router