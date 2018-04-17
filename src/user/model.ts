import * as mongoose from "mongoose"
import * as bcrypt from "bcrypt-nodejs"

export type UserModel = mongoose.Document & {
    login: string,
    email: string,
    password: string,
    admin: Boolean,
    email_was: string,
    current_level: mongoose.Types.ObjectId,

    validPassword: (candidatePassword: string, cb: (err: Error, isMatch: boolean) => void) => boolean,
    comparePasswords: (candidatePassword: string) => void
}

// Schema
const userSchema = new mongoose.Schema({
    login: { type: String },
    email: {type: String, unique: true},
    password: String,
    admin: { default: false, type: Boolean },
    current_level: {type: mongoose.Schema.Types.ObjectId, ref: 'Level'}
}, { timestamps: true })

/**
* Crypt the password before save
*/
userSchema.pre("save", function save(next) {
    const user = <UserModel>this;
    if (!this.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

/**
 * Compare passwords
 */
userSchema.methods.validPassword = function (candidatePassword: string, cb: Function) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
}

/**
 * @todo
 * Check if the user is in a game
 */
userSchema.methods.inGame = function() {
    return false;
}

export const User = mongoose.model("User", userSchema)
export default User
