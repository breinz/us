import * as express from "express"
import User, { UserModel } from "../back/user/model"
import goals from './goals'
import users from "./users"
import actions from "./actions"
import dev from "./dev"
import { Game } from "../back/game/model";
import { Cell } from "../back/cell/model";
import * as i18n from "i18n"
import { Item } from "../back/item/model";
import { Us } from "../us";

const router = express.Router()

router.use((req, res, next) => {
    console.info("api ---", req.method, req.url);
    next()
})

// goals
router.use("/goals", goals)
router.use("/users", users)
router.use("/actions", actions)
router.use("/dev", dev);

router.get('/', (req, res) => {
    res.send({ data: [] })
})

router.get("/game", async (req, res) => {
    const user = <UserModel>req.user;
    if (!user.inGame()) res.send({ error: 'notInGame' })

    const game = await Game.findById(user.currentGame)
    /*.populate({
        path: "cells", select: "neighbors",
        populate: [
            { path: "neighbors.left", select: "ground" },
            { path: "neighbors.right", select: "ground" },
            { path: "neighbors.top", select: "ground" },
            { path: "neighbors.bottom", select: "ground" },
        ]
    })*/
    /*.populate({
        path: "cells.cell",
        populate: {
            path: "buildings.building"
        }
    }
    )*/

    res.send({ currentGame: game })
})

router.get("/map", async (req, res) => {
    const user = <UserModel>req.user;
    if (!user.inGame()) res.send({ error: 'notInGame' })

    const map = await Game.findById(user.currentGame).select("cells")
        .populate({
            path: "cells", select: "neighbors, ground",
            populate: [
                { path: "neighbors.left", select: "ground" },
                { path: "neighbors.right", select: "ground" },
                { path: "neighbors.top", select: "ground" },
                { path: "neighbors.bottom", select: "ground" },
            ]
        })

    res.send({ map: map })
})

/**
 * Get the current cell's data
 */
router.get("/cell", async (req, res) => {
    const user = <UserModel>req.user;
    if (!user.inGame()) res.send({ error: 'notInGame' })

    let cell = await Cell.findById(user.currentCell)
        .populate("buildings.building")
        .populate("neighbors.left", "ground")
        .populate("neighbors.right", "ground")
        .populate("neighbors.top", "ground")
        .populate("neighbors.bottom", "ground")
        .populate("items.item")

    res.send(cell)
})

/**
 * Get translations
 */
router.get('/i18n', (req, res) => {
    var catalog = i18n.getCatalog(req)
    /*for (const key in catalog) {
        if (key !== "items" && key !== "buildings" && key !== "actions") {
            delete catalog[key]
        }
    }*/
    res.send(catalog)
})

/**
 * Items
 */
router.get('/items', async (req, res) => {
    let items = await Item.find()
    res.send({ items: items })
})

export default router