class Dispatcher {

    public SELECT_BUILDING = "selectBuilding";
    public SELECT_BACKGROUND = "selectBackground"

    public UPDATE_BAG = "update_bag";

    public SHOW_MAP = "show_map"
    public HIDE_MAP = "hide_map"

    public SELECT_ITEM = "item_select"

    public REST = "rest";
    public SLEEP = "sleep";

    public DIG = "dig"
    public DIG_END_LEVEL = "dig_end_level"
    public DIG_HIT_WALL = "dig_hit_wall"
    public DIG_END = "dig_end"
    public DIG_NEXT_LEVEL = "dig_Next_level"
    public DIG_FOLLOW = "dig_follow"
    public DIG_UNDIG_ITEM = "dig_undig_item"
    public DIG_USER_MOVED = "dig_user_moved"

    private catalog: { [index: string]: Function[] } = {}


    public dispatch(type: string, ...args: any[]) {
        if (!(type in this.catalog)) return;

        this.catalog[type].forEach(callback => {
            callback.apply(null, args)
        });
    }

    public on(type: string, callback: Function) {
        if (this.catalog[type] === undefined) {
            this.catalog[type] = []
        }
        this.catalog[type].push(callback)
    }

    public off(type: string, callback: Function) {
        for (let index = this.catalog[type].length - 1; index >= 0; index--) {
            if (this.catalog[type][index] === callback) {
                delete this.catalog[type][index]
            }

        }
    }
}

export default new Dispatcher()