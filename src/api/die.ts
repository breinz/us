import { Request } from "express";
import { User, UserModel } from "../back/user/model";

export default async function die(req: Request, reason: string) {
    const user = await User.findById(req.user._id).populate("items.bag.item") as UserModel

    user.currentGame = null;

    await user.save();
} 