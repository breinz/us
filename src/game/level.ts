import * as Pixi from "pixi.js"

class Lvl {
    /**
     * Pixi application
     */
    private app:Pixi.Application;

    /**
     * Init
     */
    public init = () => {
        this.app = new Pixi.Application({
            width:220,
            height: 220,
            transparent: true,
            antialias: true
        })
        document.getElementById("user-lvl").appendChild(this.app.view)

        this.drawStar();
    }

    /**
     * Draw the star
     */
    private drawStar = () => {

        let angle = -36;
        const innerDist = 38;
        let star_element;
        for (let index = 0; index < 5; index++) {
            star_element = new Pixi.Graphics()
            star_element.beginFill(index <2 ? 0XFFFF00 : 0xDDDDDD)
            //star_element.lineStyle(1, 0x707070)
            star_element.drawPolygon([
                110, 110, 
                110+Math.cos(   (angle-90)*Math.PI/180)*innerDist , 110+Math.sin(   (angle-90)*Math.PI/180)*innerDist,
                110+Math.cos((angle+36-90)*Math.PI/180)*100, 110+Math.sin((angle+36-90)*Math.PI/180)*100,
                110+Math.cos((angle+72-90)*Math.PI/180)*innerDist , 110+Math.sin((angle+72-90)*Math.PI/180)*innerDist
            ])
            this.app.stage.addChild(star_element);

            angle+= 72;
        }

        const border = new Pixi.Graphics();
        border.lineStyle(1, 0x707070)
        let ar:Array<number> = []
        angle = -90;
        for (let b = 0; b < 5; b++) {
            ar.push(110+Math.cos(angle*Pixi.DEG_TO_RAD)*100)
            ar.push(110+Math.sin(angle*Pixi.DEG_TO_RAD)*100)
            angle += 36
            ar.push(110+Math.cos(angle*Pixi.DEG_TO_RAD)*innerDist)
            ar.push(110+Math.sin(angle*Pixi.DEG_TO_RAD)*innerDist)
            angle += 36
        }
        border.drawPolygon(ar).closePath()
        this.app.stage.addChild(border)
    }
}

export default Lvl;