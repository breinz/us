import axios from "axios"

class i18n {
    
    private catalog: any;

    public init() {
        return axios.get("/api/i18n").then(res => {
            this.catalog = res.data;
            console.log(this.catalog);
        })
    }

    /**
     * Gets a translation
     * @param value The key to search (can contain dots for object notation)
     */
    public __(value: string) {
        let ar = value.split(".")
        let result: any;
        ar.map(value => {
            result = result === undefined ? this.catalog[value] : result[value]
        })
        return result.replace(/\[icon (\d+)\,(\d+)\]/g, "<i class=\"item_img-still bg-x$1 bg-y$2\"></i>");
    }
}

export default new i18n();