import * as express from "express"
import string from "./items/string"
import { User, UserModel } from "../back/user/model";

let router = express.Router()

router.use("/string", string)

/**
 * @param bagItem_id
 */
router.post("/equip", async (req, res) => {
    const user = await
        User.findById(req.user.id)
            .populate("items.bag.item")
            .populate("items.equipped.item") as UserModel;

    // The bagItem to equip
    const item = user.items.bag.id(req.body.bagItem_id)

    user.items.equipped.push(item)

    user.items.bag.remove(item);

    await user.save();

    res.send({ success: true, items: user.items });
})

export default router;
