import { cell } from "../main";

class Debug extends PIXI.Container {

    private frame: number

    private bg: PIXI.Graphics
    private fps: PIXI.Text
    private arFps: number[]
    private objVar: number

    constructor() {
        super()

        this.bg = new PIXI.Graphics()
        this.addChild(this.bg)

        this.fps = new PIXI.Text("", { fontSize: 11, fill: 0xFFFFFF })
        this.fps.x = this.fps.y = 2
        this.addChild(this.fps)

        this.frame = 0
        cell.app.ticker.add(this.ticker.bind(this))
        setInterval(this.second.bind(this), 1000)

        this.arFps = []
    }

    private ticker() {
        this.frame++
    }

    private second() {
        // Register the fps
        this.arFps.push(this.frame)
        if (this.arFps.length > 10) {
            this.arFps.shift()
        }

        // Calculate the average fps
        let ave = 0
        for (let i = 0; i < this.arFps.length; i++) {
            ave += this.arFps[i]
        }
        ave /= this.arFps.length
        ave = Math.round(ave);

        // Count the number of children
        this.objVar = 0
        let children = this.countChildren();

        // Display fps and average
        this.fps.text = `${this.frame} fps ${ave} ave ${children}+${this.objVar} obj`
        this.frame = 0

        // lUpdate background
        this.bg.clear()
        this.bg.beginFill(0)
        this.bg.drawRect(0, 0, this.fps.width + 4, this.fps.height + 4)
    }

    private countChildren(): number {
        let count = 0;
        for (let i = 0; i < cell.app.stage.children.length; i++) {
            count += this.countSubChildren(cell.app.stage.children[i] as PIXI.Container);
        }
        return count;
    }

    private countSubChildren(child: PIXI.Container): number {
        if ((child as any)['countInDebug'] === false) {
            this.objVar++;
            return 0
        }

        let count = 1

        if (child.children !== null) {
            for (let i = 0; i < child.children.length; i++) {
                count += this.countSubChildren(child.children[i] as PIXI.Container)
            }
        }
        return count
    }

}

export default Debug;