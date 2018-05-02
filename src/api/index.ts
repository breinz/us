import * as express from "express"
import User, { UserModel } from "../user/model"
import goals from './goals'
import users from "./users"
import actions from "./actions"
import { Game } from "../game/model";
import { Cell } from "../cell/model";

const router = express.Router()

// goals
router.use("/goals", goals)
router.use("/users", users)
router.use("/actions", actions)

router.get('/', (req, res) => {
    res.send({ data: [] })
})

router.get("/game", async (req, res) => {
    const user = <UserModel>req.user;
    if (!user.inGame()) res.send({error:'notInGame'})

    let game = await Game.findById(user.currentGame)
        .populate({
            path: "cells.cell",
            populate: {
                path: "buildings.building"
            }
        }
    )

    res.send({currentGame: game})
})

router.get("/cell", async (req, res) => {
    const user = <UserModel>req.user;
    if (!user.inGame()) res.send({error:'notInGame'})

    let cell = await Cell.findById(user.currentCell)
        .populate("buildings.building")

    res.send(cell)
})

export default router