import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator/check"
import { User, UserModel } from "./model"

export default {

    /**
     * POST /signin
     */
    postSignin: (req:Request, res:Response, next:NextFunction) => {

        console.log("--------");
        console.log(req.body);
        console.log("--------");

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

        // Create a user
        const user = new User({
            email: req.body.email,
            password: req.body.password
        });

        // Save that user
        user.save((err, u: UserModel) => {
            if (err) return next(err)
            
            // Log that user in
            /*req.logIn(user, err => {
                if (err) return next(err);
                res.flash("success", [{msg: "flash.signin:Bienvenue {{el}}", placeholders: {el: u.email}}]);
                res.redirect("/");
            })*/
        });
    }
}