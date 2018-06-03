class Dispatcher {

    private catalog:{[index: string] : Function[]} = {}

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
        for (let index = this.catalog[type].length-1; index >= 0; index--) {
            if (this.catalog[type][index] === callback) {
                delete this.catalog[type][index]
            }
            
        }
    }
}

export default new Dispatcher()