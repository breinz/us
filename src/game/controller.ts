import { Request, Response, NextFunction } from "express";
import * as passport from "passport"
import {GameModel} from "./model"

export default {

    /**
     * Join a new game
     */
    join: (req:Request, res:Response, next:NextFunction) => {
        // If not logged in, redirect to login
        if (!req.user) res.redirect("/login")
        // if already in game, redirect to home
        if (req.user.inGame()) res.redirect("/")

        req.user.joinGame()
            .then((game:GameModel) => {
                res.redirect("/")
            })
            .catch((err:Error) => {
                console.log(err);
                res.sendStatus(400)
            });
    }
}