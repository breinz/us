import * as express from "express"
import { Quest, QuestModel } from "../quest/model";

let router = express.Router();

/**
 * Quests index
 */
router.get("/", async (req, res) => {
    let quests = await Quest.find()

    res.render("admin/quests/index", {
        bc: ["Quests"],
        quests: quests
    })
})

/**
 * New quest form
 */
router.get("/new", (req, res) => {
    res.render("admin/quests/new")
})

/**
 * New quest
 */
router.post("/new", async (req, res) => {
    let quest = new Quest({
        name: req.body.name
    });

    await quest.save()

    res.redirect("/admin/quests")
})

/**
 * Edit form
 */
router.get("/:id/edit", async (req, res) => {
    let quest = await Quest.findById(req.params.id) as QuestModel

    res.render("admin/quests/edit", {
        bc: [
            ["Quests", "/quests"],
            [quest.name, `/quests/${quest.id}`],
            ["Edit"]
        ],
        quest: quest
    })
})

/**
 * Edit
 */
router.post("/:id/edit", async (req, res) => {
    let quest = await Quest.findById(req.params.id) as QuestModel;

    quest.name = req.body.name;

    await quest.save()

    res.redirect("/admin/quests")
})

/**
 * Delete quest
 */
router.get("/:id/delete", async (req, res) => {
    await Quest.findByIdAndRemove(req.params.id)

    res.redirect("/admin/quests")
})

export default router;