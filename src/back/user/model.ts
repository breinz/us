import * as mongoose from "mongoose"
import * as bcrypt from "bcrypt-nodejs"
import { Document, Schema, model } from "mongoose"
import { GoalModel, Goal, goalSchema } from "../goal/model";
import { Level } from "../level/model";
import { Game, GameModel } from "../game/model";
import { CellModel, Cell } from "../cell/model";
import { ItemModel } from "../item/model";

export type UserItemModel = {
    _id?: any,
    ammo?: number,
    poisoned?: boolean,
    item: ItemModel
}

export type UserModel = Document & {
    login: string,
    email: string,
    password: string,
    admin: boolean,
    email_was: string,
    current_level: mongoose.Types.ObjectId,
    goals: GoalModel[] & Document,
    currentGame: mongoose.Types.ObjectId,
    currentCell: mongoose.Types.ObjectId | string,
    x: number,
    y: number,
    /** Play mode 0: exploration 1: fight */
    mode: number,
    team: number,
    /** Items owned by the user */
    items?: mongoose.Types.Array<UserItemModel> & Document,
    dig: {
        /** 
         * How pa are used while digging 
         * - 1 is normal
         * - 2 is slower (less pa)
         */
        pa: number,
        /** How many dig sessions started */
        count: number,
        /** How many levels done */
        level_count: number,
        /** How many walls hit */
        hitWall_count: number,
        /** How many items revealed */
        revealItem_count: number,
        /** Params for THIS GAME ONLY */
        current: {
            /** How many dig sessions started during this game */
            count: number,
            /** How many levels done during this game */
            level_count: number,
            /** How many walls hit during this game */
            hitWall_count: number,
            /** How many items revealed during this game */
            revealItem_count: number
        }
    },
    rest: {
        /** At what time (timestamp) did you go to sleep (in ms) */
        at: number,
        /** What was your pa when you went to sleep */
        pa: number,
        /** Where do you sleep (bed: speed=5, outside: speed=0) */
        speed: number,
    },
    /** Last time the user drank */
    drank_at: number,
    /** Display tutorials or not */
    tuto: boolean,
    /** Number of Action Points */
    pa: number,

    validPassword: (candidatePassword: string, cb: (err: Error, isMatch: boolean) => void) => boolean,
    comparePasswords: (candidatePassword: string) => void,
    addGoal: (goal: string, cb?: Function) => void,
    inGame: () => boolean,
    hasItem: (name: ItemModel | string, count?: number) => mongoose.Types.ObjectId
}

// Schema
const userSchema = new Schema({
    login: { type: String },
    email: { type: String, unique: true },
    password: String,
    admin: { default: false, type: Boolean },
    current_level: { type: Schema.Types.ObjectId, ref: "Level" },
    goals: [goalSchema], /** @todo shouldn't we use ObjectId instead */
    currentGame: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
    currentCell: { type: mongoose.Schema.Types.ObjectId, ref: "Cell" },
    x: { type: Number, default: 400 },
    y: { type: Number, default: 400 },
    mode: { type: Number, default: 0 },
    team: Number,
    items: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        ammo: Number,
        poisoned: Boolean
    }],
    //dig_count: Number,
    dig: {
        pa: { type: Number, default: 1 },
        current: {
            count: { type: Number, default: 0 },
            level_count: { type: Number, default: 0 },
            hitWall_count: { type: Number, default: 0 },
            revealItem_count: { type: Number, default: 0 }
        },
        count: { type: Number, default: 0 },
        level_count: { type: Number, default: 0 },
        hitWall_count: { type: Number, default: 0 },
        revealItem_count: { type: Number, default: 0 }
    },
    rest: {
        at: Number,
        pa: Number,
        speed: Number,
    },
    drank_at: Number,
    tuto: Boolean,
    pa: Number
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
            Level.findOne({ level: 0 }),
            user.addGoal("register")
        ]).then(([level, u]) => {
            user.current_level = level.id;
            user.tuto = true;
            next()
        }).catch(err => {
            next(err)
        })
    }

    // Max 1000 pa
    if (user.pa > 1000) user.pa = 1000;
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
    const user: UserModel = <UserModel>this;

    Goal.findOne({ phrase: goal }, (err, res: GoalModel) => {
        if (err) cb(err)
        if (res == null) cb(new Error(`Goal '${goal}' doesn't exist`))
        user.goals.push(res)
        cb()
    })
}
userSchema.methods.addGoal = function (goal: string) {
    const user: UserModel = this;

    return new Promise(function (resolve, reject) {
        Goal.findOne({ phrase: goal }, (err, res: GoalModel) => {
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
userSchema.methods.inGame = function () {
    return this.currentGame !== undefined && this.currentGame !== null
}

/**
 * Join a game
 * @return Promise
 */
userSchema.methods.joinGame = async function () {
    const user: UserModel = this;

    let game: GameModel = await Game.findToJoin();
    let cell: CellModel = await Cell.findToJoin(game.id)

    user.currentGame = game.id;
    user.currentCell = cell.id;
    user.team = cell.homeForTeam;

    user.drank_at = null;
    for (let i = user.items.length; i >= 0; i--) {
        user.items.remove(user.items[i])
    }
    user.dig.current.count = 0;
    user.dig.current.hitWall_count = 0;
    user.dig.current.level_count = 0;
    user.dig.current.revealItem_count = 0;
    user.pa = 1000;

    cell.joined++;

    game.count_users++

    await Promise.all([
        user.save(),
        game.save(),
        cell.save()
    ])

    return game
}

/**
 * Does that user have an item
 * @param name Item name
 */
userSchema.methods.hasItem = function (item: ItemModel | string, count?: number): mongoose.Types.ObjectId | boolean {
    const user: UserModel = this;

    let has;
    let howMany = 0;
    for (let itemId = 0; itemId < user.items.length; itemId++) {
        has = user.items[itemId];
        if (item.hasOwnProperty("_id")) {
            if (has.item.equals((item as ItemModel)._id)) {
                if (count === undefined) {
                    return has._id;
                } else {
                    howMany++
                }
            }
        } else {
            if (has.item.name === item) {
                if (count == undefined) {
                    return has._id
                } else {
                    howMany++;
                }
            }
        }

    }

    if (count !== undefined) {
        return howMany >= count;
    }

    return null;
}

export const User = model("User", userSchema) as mongoose.Model<Document> & UserModel
export default User
