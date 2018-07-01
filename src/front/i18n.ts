import axios from "axios"

class i18n {

    private catalog: any;

    public init() {
        return axios.get("/api/i18n").then(res => {
            this.catalog = res.data;
        })
    }

    /**
     * Gets a translation
     * @param phrase The key to search (can contain dots for object notation)
     */
    public __(phrase: string) {
        let ar = phrase.split(".")
        let result: any;
        ar.map(value => {
            result = result === undefined ? this.catalog[value] : result[value]
        })
        if (result === undefined) {
            throw new Error(`Translation not found: ${phrase}`)
        }
        return result.replace(/\[icon (\d+)\,(\d+)\]/g, "<i class=\"item_img-still bg-x$1 bg-y$2\"></i>");
    }

    public _n(phrase: string, count: number): string {
        let ar = phrase.split(".")
        let result: any;
        ar.map(value => {
            result = result === undefined ? this.catalog[value] : result[value]
        })
        if (result === undefined) {
            throw new Error(`Translation not found: ${phrase}`)
        }
        if (count === 1) {
            result = result["one"]
        } else {
            result = result["other"]
        }
        return result.replace(/\[icon (\d+)\,(\d+)\]/g, "<i class=\"item_img-still bg-x$1 bg-y$2\"></i>").replace(/%s/, count);
    }
}

export default new i18n();