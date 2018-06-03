import * as express from "express"

const router = express.Router()

/**
 * Quit digging
 * @param items The leftovers items
 */
router.post("/quit", async (req, res) => {
    const items = req.body.items
})

export default router;