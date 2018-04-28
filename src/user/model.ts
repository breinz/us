import * as mongoose from "mongoose"
import * as bcrypt from "bcrypt-nodejs"
import { Document, Schema, model } from "mongoose"
import { GoalModel, Goal, goalSchema } from "../goal/model";
import { Level } from "../level/model";
import { Game, GameModel } from "../game/model";

export type UserModel = Document & {
    login: string,
    email: string,
    password: string,
    admin: Boolean,
    email_was: string,
    current_level: mongoose.Types.ObjectId,
    goals: GoalModel[] & Document,
    currentGame: mongoose.Types.ObjectId,

    validPassword: (candidatePassword: string, cb: (err: Error, isMatch: boolean) => void) => boolean,
    comparePasswords: (candidatePassword: string) => void,
    addGoal: (goal: string, cb?: Function) => void
}

// Schema
const userSchema = new Schema({
    login: { type: String },
    email: {type: String, unique: true},
    password: String,
    admin: { default: false, type: Boolean },
    current_level: {type: Schema.Types.ObjectId, ref: "Level"},
    goals: [goalSchema],
    currentGame: {type: mongoose.Schema.Types.ObjectId, ref: "Game"}
}, { timestamps: true })

/**
* Before save
*/
userSchema.pre("save", function save(next) {
    const user = <UserModel>this;

    // Crypt the password
    if (!this.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, undefined, (err: Error, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            if (!user.isNew) {
                next();
            }
        });
    });

    // Initialize the user in the game
    if (user.isNew) {
        Promise.all([
            Level.findOne({level:0}),
            user.addGoal("register")
        ]).then(([level, u]) => {
            user.current_level = level.id;
            next()
        }).catch(err => {
            next(err)
        })
        /*Level.findOne({level:0}, (err, level) => {
            if (err) next(err)
            user.current_level = level.id;
        })
        user.addGoal("register", next)*/
    }
});

/**
 * Compare passwords
 */
userSchema.methods.validPassword = function (candidatePassword: string, cb: Function) {
    bcrypt.compare(candidatePassword, this.password, (err: Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
}

/**
 * Add a goal to the user
 * @param goal The goal phrase
 */
userSchema.methods.addGoal = function (goal: string, cb: Function) {
    const user:UserModel = <UserModel>this;

    Goal.findOne({phrase: goal}, (err, res:GoalModel) => {
        if (err) cb(err)
        if (res == null) cb(new Error(`Goal '${goal}' doesn't exist`))
        user.goals.push(res)
        cb()
    })
}
userSchema.methods.addGoal = function (goal: string) {
    const user:UserModel = this;

    return new Promise(function (resolve, reject) {
        Goal.findOne({phrase: goal}, (err, res:GoalModel) => {
            if (err) reject(err)
            if (res == null) reject(`Goal '${goal}' doesn't exist`)
            user.goals.push(res)
            resolve(user)
        })
    })
}

/**
 * @todo
 * Check if the user is in a game
 */
userSchema.methods.inGame = function() {
    return this.currentGame !== undefined
}

/**
 * Join a game
 * @return Promise
 */
userSchema.methods.joinGame = async function () {
    const user:UserModel = this;

    let game:GameModel;
    game = <GameModel>await Game.findOne({count_users: { $lt: 20 } }).exec()

    if (!game) {
        game = <GameModel>new Game()
        game = await game.save()
    }

    user.currentGame = game.id;
    await user.save()

    game.count_users++
    await game.save()

    return game
}

export const User = model("User", userSchema)
export default User
