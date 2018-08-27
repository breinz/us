import * as express from "express"
import { User, UserModel } from "../../back/user/model";
import { Item, ItemModel } from "../../back/item/model";


let router = express.Router()

router.post("/assemble", async (req, res) => {
    const user = await User.findById(req.user._id).populate("items.bag.item") as UserModel

    if (!user.hasItem("string", 5)) {
        return res.send({ error: "items.string.assemble.not_enough" })
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
    console.log(rope);

    user.items.bag.push({ item: rope })

    await user.save()

    res.send({ success: true, bag: user.items.bag });
})

export default router