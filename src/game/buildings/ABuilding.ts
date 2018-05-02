import { BuildingData } from "../buildings/BuildingFactory";
import IBuilding from "./IBuilding";
import IAction from "../actions/IAction";
import { cos, sin } from "../helper";
import { TweenLite, Back } from "gsap"
import {cell} from "../main"

class ABuilding implements IBuilding {
    
    /**
     * The layer where to draw the building
     */
    protected layer:PIXI.Container;

    /**
     * Data
     */
    protected data:BuildingData;

    /**
     * The actual building as seen on stage
     */
    protected container:PIXI.Container

    /**
     * Container to hold all the "over" elements
     * and to be used as 'mouseout' trigger
     * - over_shape
     * - actions
     */
    private over_container:PIXI.Container

    /**
     * Shape to use as a 'mouseout' trigger
     */
    private over_shape:PIXI.Graphics;


    constructor(data:BuildingData, layer:PIXI.Container) {
        this.data = data;
        this.layer = layer;
        
        this.drawBuilding()
        this.prepareActions()
    }

    /**
     * Draw the building
     */
    protected drawBuilding(): void {
        this.container.x = this.data.x;
        this.container.y = this.data.y;

        this.container.interactive = true;
        this.container.on("mouseover", this.onMouseOver.bind(this))
        //this.container.on("mouseout", this.onMouseOut.bind(this))

        this.layer.addChild(this.container)

        this.over_container = new PIXI.Container();
        this.over_container.x = this.data.x
        this.over_container.y = this.data.y
        this.over_container.interactive = true
        this.over_container.on("mouseout", this.onMouseOut.bind(this))

        this.over_shape = new PIXI.Graphics();
        this.over_shape.beginFill(0, 0)
        this.over_shape.drawCircle(0, 0, 75)
        this.over_container.addChild(this.over_shape)
    }

    /**
     * Prepare different actions (available or not)
     * by setting their UI and Callback
     */
    protected prepareActions(): void {
        throw new Error("Please override `prepareActions`")
    }

    /**
     * Different available actions
     */
    protected get actions():IAction[] {
        return null
    }

    // **************************************************
    // Events
    // **************************************************

    /**
     * Mouse over
     * @param event The event
     */
    private onMouseOver(event:Event): void {
        const actions = this.actions;

        if (!actions || actions.length === 0) return;

        this.layer.addChild(this.over_container);
        
        let action:IAction;
        // Every action
        for (let a = 0; a < actions.length; a++) {
            action = actions[a];

            if (!action.shape.interactive) {
                action.shape.interactive = true;
                action.shape.on("click", action.fct)
            }

            // Add it to stage
            this.over_container.addChild(action.shape);

            // Position correctly
            action.shape.x = cos(a*360/actions.length-90)*40;
            action.shape.y = sin(a*360/actions.length-90)*40;
            action.shape.alpha = 1;

            // Animate from the center
            TweenLite.from(action.shape, .5, {
                x:0, 
                y:0,
                alpha: 0,
                ease: Back.easeOut
            })
            
        }
    }

    /**
     * @todo do it from a background who wraps everything
     */
    private onMouseOut(e:Event): void {
        const actions = this.actions;

        if (!actions || actions.length === 0) return;

        //this.over_shape.off("mouseout", this.onMouseOut.bind(this))
        //this.layer.removeChild(this.over_shape)

        let action:IAction;
        const layer:PIXI.Container = this.layer;
        const over_container = this.over_container
        for (let a = 0; a < actions.length; a++) {
            action = actions[a];

            // Not interactive anymore
            action.shape.interactive = false;
            action.shape.off("click", action.fct)

            // Fold into the center
            TweenLite.to(action.shape, .5, {
                x:0, 
                y:0,
                alpha: 0,
                ease: Back.easeIn,
                onComplete: (function () {
                    // Remove from stage
                    /** @todo remove once (now it's as many time as there are actions) */
                    layer.removeChild(over_container)
                })
            })
            
        }
    }
}

export default ABuilding;