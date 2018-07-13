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

    let game = await Game.findById(user.currentGame)
        .populate({
            path: "cells.cell",
            populate: {
                path: "buildings.building"
            }
        }
        )

    res.send({ currentGame: game })
})

router.get("/cell", async (req, res) => {
    const user = <UserModel>req.user;
    if (!user.inGame()) res.send({ error: 'notInGame' })

    let cell = await Cell.findById(user.currentCell)
        .populate("buildings.building").populate("items")

    res.send(cell)
})

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