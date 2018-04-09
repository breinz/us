import * as express from "express"
import * as mongoose from "mongoose"
import config from "./config"
import * as path from "path"
import userController from "./user/controller"
import userCheck from "./user/check"
import * as cookieParser from "cookie-parser"
import * as bodyParser from "body-parser"
import * as session from "express-session"
import * as i18n from "i18n"
import apiRouter from "./api"

let app = express()

// --------------------------------------------------
// CONFIGURE
// --------------------------------------------------

// View engine
app.set('view engine', 'pug')

// i18n
i18n.configure({
    locales: ["en", "fr"],
    directory: path.join(__dirname, "locales"),
    autoReload: true,
    objectNotation: true
});

// --------------------------------------------------
// USE
// --------------------------------------------------

// Static content
app.use(express.static(path.join(__dirname, "/public")))

// Cookie parser
app.use(cookieParser())

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session
app.use(session({
    resave: true,
    saveUninitialized: true,
    // TODO
    secret: "toputinaconfigfile"
}))

app.use(i18n.init)

app.use("/api", apiRouter)

// --------------------------------------------------
// ROUTES
// --------------------------------------------------

// Routes
app.get("/", (req, res) => {
    res.render("index")
})
app.get("/signin", (req, res) => {
    res.render("user/signin")
})
app.post("/signin", userCheck.postSignin, userController.postSignin)

// --------------------------------------------------
// MONGOOSE
// --------------------------------------------------

// Mongoose connect
mongoose.connect(config.mongoUri)
    .then(db => {
        console.log(`DB Connected ${config.mongoUri}`)
    }).catch(err => {
        console.error(err)
    })

export default app;