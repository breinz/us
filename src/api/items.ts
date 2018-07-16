import * as express from "express"
import string from "./items/string"

let router = express.Router()

router.use("/string", string)

export default router;
