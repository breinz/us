import { check } from "express-validator/check"
import User from "./model"

export default {

    // POST /signin
    postSignin: [
        check("email", "check.invalidEmail").isEmail()
        .trim()
        .normalizeEmail({gmail_remove_dots: false})
        .custom( value => {
            const findOne = User.findOne({email: value})
            findOne.exec();
            return findOne.then(user => {
                if (user) {
                    throw new Error("check.existingUser");
                } else {
                    return value;
                }
            })
        }),
    
        // Password
        // -should be at least 3 character
        // -should match with password_confirm
        check("password", "check.invalidPassword").isLength({min: 3})
            .custom((value, {req}) => value === req.body.password_confirm)
            .withMessage("check.passwordsDontMatch")
    ],
}