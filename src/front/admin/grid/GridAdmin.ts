import * as PIXI from "pixi.js"

export default class GridAdmin {

    public app: PIXI.Application;

    constructor() {
        PIXI.utils.skipHello();
        this.app = new PIXI.Application({
            width: 560,
            height: 560,
            transparent: false,
            antialias: true
        })
        document.getElementById("grid-admin").appendChild(this.app.view)

        this.app.stage.interactive = true;


    }
}