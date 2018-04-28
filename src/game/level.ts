/** @see home_out.pug */
declare const a:number;
declare const l:number;
declare const g:number;

import * as Pixi from "pixi.js"
import * as h from "./helper"

class Lvl {
    /**
     * Pixi application
     */
    private app:Pixi.Application;

    /**
     * Number of goals
     * @see g
     */
    private goals:number;

    /**
     * Number of archieved goals
     * @see a
     */
    private archieved:number;

    /**
     * Current level
     * @see l
     */
    private level:number;

    /**
     * Outer dist
     */
    private outerDist:number;

    /**
     * Inner dist
     */
    private innerDist:number;

    /**
     * Star border
     */
    private border:Pixi.Graphics;

    /**
     * Star elements
     */
    private elements:[Pixi.Graphics];

    /**
     * Animation
     */
    private index:number = 0;

    /**
     * Star center (for animation)
     */
    private center:[number, number];

    /**
     * Star angle (for animation)
     */
    private _angle:number = 0;

    public static colors:number[] = [0xFFFF00, 0xFFFF00];

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

        this.archieved = a;
        this.level = l;
        this.goals = g;
        this.outerDist = 88;
        this.innerDist = 28;

        this.center = [110, 110]

        // Star elements
        let e;
        for (let index = 0; index < this.goals; index++) {
            e = new Pixi.Graphics();
            e.interactive = true;
            e.on("mouseover", () => {
                document.getElementById(`goal${index}`).classList.add("hover")
            })
            e.on("mouseout", () => {
                document.getElementById(`goal${index}`).classList.remove("hover")
            })
            if (this.elements) {
                this.elements.push(e);
            } else {
                this.elements = [e];
            }
            this.app.stage.addChild(e);
        }

        // Star border
        this.border = new Pixi.Graphics();
        this.app.stage.addChild(this.border)

        this.drawStar();
        this.app.ticker.add(this.animateStar)
    }

    /**
     * Draw the star
     */
    private drawStar = () => {

        //let angle = -36;
        const outerDist = 58
        const innerDist = 58;
        //let star_element;

        // angle between two star branches
        let a = 360/this.goals;

        let angle = a + this._angle;

        let border_ar = [];
        let dax, day, dbx, dby, dcx, dcy;

        let e

        for (let index = 0; index < this.goals; index++) {
            e = this.elements[index];

            e.clear();
            //e.beginFill(Lvl.colors[this.level], index < this.archieved ? 1 : 0)
            e.beginFill(index < this.archieved ? Lvl.colors[this.level] : 0xEEEEEE)
            e.lineStyle(.5, 0x707070, .5)

            dax = this.center[0]+h.cos(angle)    *this.innerDist
            dbx = this.center[0]+h.cos(angle+a/2)*this.outerDist
            dcx = this.center[0]+h.cos(angle+a)  *this.innerDist

            day = this.center[1]+h.sin(angle)    *this.innerDist
            dby = this.center[1]+h.sin(angle+a/2)*this.outerDist
            dcy = this.center[1]+h.sin(angle+a)  *this.innerDist  

            e.drawPolygon([
                this.center[0], this.center[1], dax, day, dbx, dby, dcx, dcy])
            //this.app.stage.addChild(star_element);

            border_ar.push(dax, day, dbx, dby)

            angle+= a;
        }

        this.border.clear()
        this.border.lineStyle(1, 0x707070)
        this.border.drawPolygon(border_ar).closePath()
        
    }

    private animateStar = () => {
        this.index++;
        this._angle += .02
        //this.outerDist += Math.cos(this.index/500)/100
        //this.innerDist += Math.cos(this.index/400)/100
        
        //this.center[0] += 1;
        this.drawStar()
    }
}


export default Lvl;