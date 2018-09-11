const messages = {
    Well: {
        GET_WATER: "well.getwater", GOT_WATER: "well.gotwater",
        ADD_WATER: "well.addwater", ADDED_WATER: "well.addedwater",
        POISON: "well.poison", POISONED: "well.poisened"

        /*GET_WATER: { UP: "well.getWater", DOWN: "well.getWater.down" },
        ADD_WATER: { UP: "well.addWater", DOWN: "well.addWater.down" },
        POISON: { UP: "well.poison", DOWN: "well.poison.down" }*/
    },
    Safe: {
        OPEN: "safe.open", OPENED: "safe.opened",
        REFILL: "safe.refill", REFILLED: "safe.refilled"
        //REFILL: { UP: "safe.refill", DOWN: "safe.refill.down" }
    }
}

export default messages;