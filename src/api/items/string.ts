import * as express from "express"
import { User, UserModel } from "../../back/user/model";
import { Item, ItemModel } from "../../back/item/model";
import { Us } from "../../us";


let router = express.Router()

router.post("/assemble", async (req, res) => {
    let ret: Us.String.ApiResult.assemble = { success: false };

    try {
        const user = await User.findById(req.user._id).populate("items.bag.item") as UserModel

        if (!user.hasItem("string", 5)) {
            ret.error = "items.string.assemble.not_enough";
            return res.send(ret);
        }

        // Remove 5 strings
        let count = 0
        for (let i = user.items.bag.length - 1; i >= 0; i--) {
            const string = user.items.bag[i]
            if (string.item.name === "string") {
                user.items.bag.remove(string)
                if (++count >= 5) break;
            }
        }

        // Add a rope
        const rope = <ItemModel>await Item.findOne({ name: "rope" })

        user.items.bag.push({ item: rope })

        await user.save()

        ret.success = true;
        ret.bag = user.items.bag;
        res.send(ret);
    } catch (err) {
        ret.fatal = err.messsage;
        res.send(ret);
    }
})

export default router