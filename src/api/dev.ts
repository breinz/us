import * as express from "express"
import { UserModel } from "../back/user/model";

let router = express.Router()

/**
 * Empty the bag
 */
router.post("/clearBag", async (req, res) => {
    const user = req.user as UserModel;
    for (let i = user.items.bag.length; i >= 0; i--) {
        user.items.bag.remove(user.items.bag[i])
    }
    await user.save()
    res.send({ success: true, bag: [] })
})

router.post("/fillAP", async (req, res) => {
    const user = req.user as UserModel;
    user.pa = 1000;
    await user.save();
    res.send({ success: true, pa: 1000 });
})


export default router;
