import * as express from "express"
import { User, UserModel } from "../back/user/model";
import { Cell, CellModel } from "../back/cell/model";
import { ItemModel } from "../back/item/model";

const router = express.Router()

/**
 * Dig
 */
router.post("/", async (req, res, next) => {
    const user = req.user as UserModel

    user.dig.count++;
    user.dig.current.count++;

    user.dig.level_count++
    user.dig.current.level_count++

    await user.save()

    res.send({ dig_count: user.dig.count })
})

/**
 * Starts a nex level
 */
router.post("/level", async (req, res) => {
    const user = req.user as UserModel

    user.dig.level_count++
    user.dig.current.level_count++

    await user.save()

    res.send({ success: true })
})

/**
 * Hit a wall
 */
router.post("/hitWall", async (req, res) => {
    const user = req.user as UserModel;

    user.dig.current.hitWall_count++;
    user.dig.hitWall_count++;

    await user.save();

    res.send({ success: true })
})

/**
 * Reveal an item
 */
router.post("/revealItem", async (req, res) => {
    const user = req.user as UserModel;

    user.dig.current.revealItem_count++;
    user.dig.revealItem_count++;

    await user.save();

    res.send({ success: true })
})

/**
 * Quit digging
 */
router.post("/quit", async (req, res) => {
    res.send({ success: "ok" })
})

export default router;