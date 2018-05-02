import { Request, Response, NextFunction } from "express";
import * as passport from "passport"
import {GameModel, Game} from "./model"
import { UserModel } from "../user/model";
import { Cell } from "../cell/model";

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
    },

    tmp_quit: async (req:Request, res:Response, next:NextFunction) => {
        let user = <UserModel>req.user;
        user.currentGame = null;
        let ar:Array<Object> = [];
        
        ar.push(user.save())
        ar.push( Game.deleteMany({}) )
        ar.push( Cell.deleteMany({}) )

        await Promise.all(ar)

        res.redirect('/');
    }
}