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

    public load(url: string) {
        console.log(url);
        let img = PIXI.Sprite.fromImage(url)
        this.app.stage.addChild(img)
    }
}