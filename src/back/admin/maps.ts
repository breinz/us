import * as express from "express"
import { Map, MapModel } from "../map/model";

let router = express.Router();

/**
 * Maps index
 */
router.get("/", async (req, res) => {

    let maps = await Map.find() as MapModel[]

    res.render("admin/maps/index", {
        bc: "Maps",
        maps: maps
    })
})

/**
 * New map form
 */
router.get("/new", (req, res) => {
    res.render("admin/maps/new", {
        bc: [
            ["Maps", "/maps"],
            ["New"]
        ]
    })
})

/**
 * Create a new map
 */
router.post("/new", async (req, res) => {
    let map = new Map({
        name: req.body.name,
        width: req.body.width,
        height: req.body.height
    });

    await map.save()

    res.redirect("/admin/maps")
})

/**
 * Edit form
 */
router.get("/:id/edit", async (req, res) => {
    let map = await Map.findById(req.params.id) as MapModel;

    res.render("admin/maps/edit", {
        bc: [
            ["Maps", "/maps"],
            [map.name, `/maps/${map.id}`],
            ["Edit"]
        ],
        map: map
    })
})

/**
 * Edit
 */
router.post("/:id/edit", async (req, res) => {
    let map = await Map.findById(req.params.id) as MapModel

    map.name = req.body.name;
    map.width = req.body.width;
    map.height = req.body.height;

    await map.save();

    res.redirect("/admin/maps")
})

/**
 * Draw form
 */
router.get("/:id/draw", async (req, res) => {
    let map = await Map.findById(req.params.id) as MapModel

    res.render("admin/maps/draw", {
        bc: [
            ["Maps", "/maps"],
            [map.name, `/maps/${map.id}`],
            "Draw"
        ],
        map: map
    })
})

/**
 * Delete a map
 */
router.get("/:id/delete", async (req, res) => {
    await Map.findByIdAndRemove(req.params.id)
    res.redirect("/maps")
})

export default router;