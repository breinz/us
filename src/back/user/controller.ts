import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator/check"
import { User, UserModel } from "./model"
import * as passport from "passport"
import { Goal } from "../goal/model";
import { Level } from "../level/model";

export default {

    getIndex: (req: Request, res: Response, next: NextFunction) => {
        if (req.user.inGame()) {
            return res.render("game/index")
        }
        
        Promise.all([
            Goal.find({ level: req.user.current_level }),
            Level.findById(req.user.current_level, "level color innerDist outerDist -_id")
        ]).then(([goals, level]) => {
            res.render("index", {
                goals: goals,
                level: level
            })
        }).catch(err => {
            next(err)
        })
        
        console.log(" ");
    },

    /**
     * GET /login
     */
    getLogin: (req: Request, res: Response) => {
        res.render("user/login")
    },

    /**
     * POST /login
     */
    postLogin: (req: Request, res: Response, next: NextFunction) => {
        var formErrors = validationResult(req)
        if (!formErrors.isEmpty()) {
            return res.render("user/login", {
                email: req.body.email,
                flash: {
                    formErrors: formErrors.array()
                }
            })
        }

        passport.authenticate("local", (err, user, info) => {
            if (err) return next(err)

            if (!user) {
                return res.render("user/login", {
                    email: req.body.email,
                    flash: {
                        formErrors: [{msg: "check.badLogin"}]
                    }
                })
            }

            req.logIn(user, err => {
                if (err) return next(err)
                //res.flash("success", [{msg: "flash.loggedIn"}])
                res.redirect("/")
            })

        })(req, res, next)
    },

    /**
     * GET /signin
     */
    getSignin: (req: Request, res: Response) => {
        res.render("user/signin")
    },

    /**
     * POST /signin
     */
    postSignin: (req: Request, res: Response, next: NextFunction) => {

        // Form errors
        const formErrors = validationResult(req);
        if (!formErrors.isEmpty()) {
            res.render("user/signin", {
                login: req.body.login,
                email: req.body.email,
                flash: {
                    formErrors: formErrors.array()
                }
            })
            return;
        }

        
        const user = new User({
            login: req.body.login,
            email: req.body.email,
            password: req.body.password
        });

        // Save that user
        user.save((err, u: UserModel) => {
            if (err) return next(err)
            
            // Log that user in
            req.logIn(user, err => {
                if (err) return next(err);
                //res.flash("success", [{msg: "flash.signin: Bienvenue {{el}}", placeholders: {el: u.email}}]);
                res.redirect("/");
            })
        });
    },

    /**
     *  GET /logout
     */
    getLogout: (req: Request, res: Response) => {
        req.logOut()
        res.redirect("/")
    }
}