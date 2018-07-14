import * as express from "express"
import * as mongoose from "mongoose"
import config from "./config"
import * as path from "path"
import userController from "./user/controller"
import userCheck from "./user/check"
import gameController from "./game/controller"
import * as cookieParser from "cookie-parser"
import * as bodyParser from "body-parser"
import * as session from "express-session"
import * as i18n from "i18n"
import apiRouter from "../api"
import adminRouter from "../back/admin"
import * as passport from "passport"
import * as passport_config from "./user/passport"
import * as capitalize from "capitalize"
import User, { UserModel } from "./user/model"; // tmp
import { Level } from "./level/model";

let app = express()

// **************************************************
// CONFIGURE
// **************************************************

// View engine
app.set('view engine', 'pug')

// i18n
i18n.configure({
    locales: ["en"/* ], */, "fr"],
    directory: path.join(__dirname, "../locales"),
    autoReload: false,
    objectNotation: true
});

app.use(i18n.init)


// **************************************************
// USE
// **************************************************

// Static content
app.use(express.static(path.join(__dirname, "../public")))

// Cookie parser
app.use(cookieParser())

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let ms = require("express-mongoose-store")(session, mongoose)

// Session
app.use(session({
    resave: false,
    saveUninitialized: false,
    // TODO
    secret: "toputinaconfigfile",
    /*cookie: { 
        maxAge: 1000*60*60*24*30
    }*/
    store: new ms({ ttl: 1000 * 60 * 60 * 24 * 30 })
}))

// --------------------------------------------------
// Passport
app.use(passport.initialize())
app.use(passport.session())
app.use(passport_config.initialize)

// Make the current user available in the response
app.use((req, res, next) => {
    res.locals.me = req.user
    next()
})

// --------------------------------------------------
// Capitalize
app.use((req, res, next) => {
    res.locals.c__ = function (str: string) {
        return capitalize(res.__(str))
    }
    res.locals.capitalize = capitalize;
    next()
})

// Routes
app.use("/api", apiRouter)
app.use("/admin", adminRouter)

// **************************************************
// ROUTES
// **************************************************

// Routes
app.get("/", (req, res, next) => {
    if (req.isAuthenticated()) {
        return userController.getIndex(req, res, next)
    }
    res.render("index")
})

app.get("/dead", (req, res, next) => {
    res.render("game/dead")
})

// --------------------------------------------------
// Signin
app.get("/signin", userController.getSignin)
app.post("/signin", userCheck.postSignin, userController.postSignin)

// --------------------------------------------------
// Login
app.get("/login", userController.getLogin)
app.post("/login", userCheck.postLogin, userController.postLogin)

// --------------------------------------------------
// Logout
app.get('/logout', userController.getLogout)

// --------------------------------------------------
// Game
app.get('/join', gameController.join)
app.get("/tmp_quit", gameController.tmp_quit)

// **************************************************
// MONGOOSE
// **************************************************

// Mongoose connect
mongoose.connect(config.mongoUri)
    .then(db => {
        console.log(`DB Connected ${config.mongoUri}`)
    }).catch(err => {
        console.error(err)
    })

export default app;