import * as express from "express"
import * as mongoose from "mongoose";
//import { Item, ItemModel } from "../item/model";
import { Item, ItemModel } from "../item/model";

let router = express.Router()

/**
 * GET /admin/items
 */
router.get("/", async (req, res, next) => {
    let items;
    try {
        items = await Item.find()
    } catch (err) {
        next(err);
    }

    res.render("admin/items/index", {
        bc: ["Items"],
        items: items
    })
})

/**
 * GET /admin/items/new
 */
router.get("/new", (req, res) => {
    res.render("admin/items/new", {
        bc: [
            ["Items", "/items"], "New"
        ]
    })
})

/**
 * POST /admin/items/new
 * @param name body
 */
router.post("/new", async (req, res, next) => {
    let item = new Item({
        name: req.body.name,
        x: req.body.x,
        y: req.body.y,
        wight: req.body.weight,
        frequency: req.body.frequency,
        frequency_change: req.body.frequency_change,
        frequency_limit: req.body.frequency_limit,
        in_safe: req.body.in_safe.checked
    })

    try {
        await item.save()
    } catch (err) {
        next(err)
    }

    res.redirect("/admin/items")
})

/**
 * GET /admin/items/:itemId/edit
 * @param itemId
 */
router.get("/:itemId/edit", async (req, res, next) => {
    let item: ItemModel;

    try {
        item = <ItemModel>await Item.findById(req.params.itemId)
    } catch (err) {
        next(err)
    }

    res.render("admin/items/edit", {
        bc: [
            ["Items", "/items/"],
            [item.name, `/items/${item.id}`],
            "Edit"
        ],
        item: item
    })
})

/**
 * POST /admin/:itemId/edit
 * @param itemId
 */
router.post("/:itemId/edit", (req, res, next) => {
    Item.findByIdAndUpdate(req.params.itemId, {
        name: req.body.name,
        x: req.body.x,
        y: req.body.y,
        weight: req.body.weight,
        frequency: req.body.frequency,
        frequency_change: req.body.frequency_change,
        frequency_limit: req.body.frequency_limit,
        in_safe: req.body.in_safe === "on"
    }, (err) => {
        if (err) next(err)
        res.redirect("/admin/items")
    })
})

/**
 * GET /admin/items/:itemId/delete
 * @param itemId
 */
router.get("/:itemId/delete", (req, res, next) => {
    Item.findByIdAndRemove(req.params.itemId, (err, doc) => {
        if (err) next(err)
        res.redirect("/admin/items")
    })
})

export default router