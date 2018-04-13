import * as passport from "passport"
import * as local from "passport-local"
import { User, UserModel } from "../user/model"
import { Request, Response, NextFunction } from "express";

const LocalStrategy = local.Strategy;

/**
* Serialize cookie
*/
passport.serializeUser(function(user: UserModel, done) {
    done(undefined, user._id);
});

/**
* Deserialize cookie
*/
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

/**
* Local strategy
*/
passport.use(new LocalStrategy({usernameField: "email"},
    function(email, password, done) {
        User.findOne({ email: email }, function(err, user: UserModel) {
            if (err) return done(err)
            if (!user) return done(null, false, { message: 'Incorrect username.' });
            user.validPassword(password, (err, isMatch) => {
                if (err) return done(err)
                if (isMatch) return done(null, user)
                return done(null, null)
            })
        })
    }
));

/**
 * @deprecated
 * Require authenticate
 */
export let isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/login");
};

/**
 * Requires to be logged in
 */
export let isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/")
    }

    next()
}

/**
 * Requires to be admin
 */
export let isAdmin = (req: Request, res: Response, next: NextFunction) => {
    // 1. To be admin, one need to be logged in
    if (!req.isAuthenticated()) {
        return res.redirect("/")
    }
     // 2. Logged in user has to be an admin
    if (req.user.admin !== true) {
        return res.redirect("/")
    }
    next()
}

export let tmp = () => {
    return 'pom';
}
console.log("passport config");