import Cell from "./Cell";
import Dig from "./Dig";
import { TweenLite, TimelineMax, Quint, Linear } from "gsap";
import { cell } from "../main";
import { RAD_TO_DEG } from "pixi.js";
import Item from "./Item";
import dispatcher from "../dispatcher";
import Axios from "axios";

class User extends PIXI.Container {

    private user: PIXI.Graphics;
    private pupil: PIXI.Graphics
    private shadow: PIXI.Sprite
    private blood: PIXI.Sprite
    private membrane: PIXI.Graphics

    private game: Dig
    private cell: Cell
    private start_cell: Cell

    private mouseOver_fct: () => void
    private follow_fct: () => void
    private mouseMove_fct: () => void
    private checkRevealItem_fct: () => void

    private mouse_pos: { x: number, y: number }

    constructor(game: Dig) {
        super()

        this.game = game;

        this.mouseOver_fct = this.onMouseOver.bind(this)
        this.follow_fct = this.follow.bind(this)
        this.mouseMove_fct = this.onMouseMove.bind(this)
        this.checkRevealItem_fct = this.checkRevealItem.bind(this)

        this.init();
    }

    private init(): void {

        this.drawUser();

        this.interactive = true;
        this.on("mouseover", this.mouseOver_fct)
    }

    /**
     * Make the user appear on a cell
     */
    public spawn(cell: Cell) {
        this.cell = cell;
        this.start_cell = cell;

        this.x = this.cell.x + this.cell.size / 2;
        this.y = this.cell.y + this.cell.size / 2;

        this.mouse_pos = { x: this.x, y: this.y }

        this.visible = true;
    }

    private drawUser() {
        // --------------------------------------------------
        // User
        this.user = new PIXI.Graphics();
        this.user.beginFill(0xFFFFFF)
        this.user.drawCircle(0, 0, 15)
        this.addChild(this.user)

        // --------------------------------------------------
        // Shadow
        this.shadow = PIXI.Sprite.fromImage("img/digUser_shadow.png");
        this.shadow.anchor.set(.5, .5)
        this.addChild(this.shadow)

        let shadow_mask = new PIXI.Graphics();
        shadow_mask.beginFill(0)
        shadow_mask.drawCircle(0, 0, 13)
        this.addChild(shadow_mask)

        this.shadow.mask = shadow_mask;

        // --------------------------------------------------
        // Blood
        this.blood = PIXI.Sprite.fromImage("img/digUser_blood.png");
        this.blood.anchor.set(.5, .5)
        this.addChild(this.blood)

        let blood_mask = new PIXI.Graphics();
        blood_mask.beginFill(0)
        blood_mask.drawCircle(0, 0, 13)
        this.addChild(blood_mask)

        this.blood.mask = blood_mask;

        // --------------------------------------------------
        // Membrane
        this.membrane = new PIXI.Graphics();
        this.membrane.lineStyle(2, 0)
        this.membrane.drawCircle(0, 0, 15)
        this.addChild(this.membrane)

        // --------------------------------------------------
        // Pupil
        this.pupil = new PIXI.Graphics();
        this.pupil.beginFill(0x0680F9)
        this.pupil.lineStyle(2, 0)
        this.pupil.drawCircle(0, 0, 5)
        this.addChild(this.pupil)

        // --------------------------------------------------
        // Mask
        this.mask = new PIXI.Graphics();
        this.mask.beginFill(0)
        this.mask.drawCircle(0, 0, 17)
        this.addChild(this.mask)
    }

    /**
     * onMouseOver
     */
    private onMouseOver(): void {
        this.following = true;
        dispatcher.dispatch(dispatcher.DIG_FOLLOW)
    }

    private onMouseMove(e: PIXI.interaction.InteractionEvent): void {
        this.mouse_pos = e.data.global;
    }

    private set following(value: boolean) {
        if (value) {
            this.off("mouseover", this.mouseOver_fct)

            cell.app.stage.on("mousemove", this.mouseMove_fct)

            cell.app.ticker.add(this.follow_fct)
            cell.app.ticker.add(this.checkRevealItem_fct)
        } else {
            // Replace the user in start_cell
            this.x = this.start_cell.x + this.start_cell.size / 2;
            this.y = this.start_cell.y + this.start_cell.size / 2;
            this.cell = this.start_cell;

            cell.app.stage.off("mousemove", this.mouseMove_fct)

            cell.app.ticker.remove(this.follow_fct)
            cell.app.ticker.remove(this.checkRevealItem_fct)

            this.on("mouseover", this.mouseOver_fct)

            // Reinitialize the user
            this.follow(0, true)
        }
    }
    private follow(d: number, reinit: boolean = false) {

        let angle = Math.atan2(this.mouse_pos.y - this.y, this.mouse_pos.x - this.x)

        let dist = Math.abs(this.mouse_pos.y - this.y) + Math.abs(this.mouse_pos.x - this.x)
        if (reinit) {
            dist = 0
        }

        this.pupil.x = Math.cos(angle) * Math.min(dist * 13 / 100, 13)
        this.pupil.y = Math.sin(angle) * Math.min(dist * 13 / 100, 13)

        this.pupil.scale = new PIXI.Point(1 - Math.min(dist * 0.3 / 100, .3), 1)
        this.pupil.rotation = angle

        this.shadow.x = Math.cos(angle) * Math.min(dist * 14 / 100, 14)
        this.shadow.y = Math.sin(angle) * Math.min(dist * 14 / 100, 14)

        this.blood.x = Math.cos(angle) * Math.min(dist * 20 / 300, 20)
        this.blood.y = Math.sin(angle) * Math.min(dist * 20 / 300, 20)

        let speed = 50;
        /** @todo Special ability */
        // speed = 30

        this.x += (this.mouse_pos.x - this.x) / speed;
        this.y += (this.mouse_pos.y - this.y) / speed;

        if (!reinit) {
            this.checkCollision();
            dispatcher.dispatch(dispatcher.DIG_USER_MOVED, this.x, this.y)
        }

    }

    private checkRevealItem() {
        let item: Item
        for (let index = 0; index < this.game.arItems.length; index++) {
            item = this.game.arItems[index];
            if (Math.abs(this.x - item.x) < 20 && Math.abs(this.y - item.y) < 20) {
                Axios.post("/api/actions/dig/revealItem")
                item.reveal()
            }
        }

        if (Math.abs(this.x - this.game.end.x) < 20 && Math.abs(this.y - this.game.end.y) < 20) {
            this.following = false
            this.game.reachEnd()
        }
    }

    private checkCollision() {
        let prev_cell = this.cell;

        this.cell = this.game.findCell(this.x, this.y)

        if (this.cell === null) {
            this.hitWall()
        } else if (prev_cell !== this.cell && !prev_cell.openTo(this.cell)) {
            this.hitWall()
        }
    }

    private hitWall() {
        this.following = false;
        dispatcher.dispatch(dispatcher.DIG_HIT_WALL)
        Axios.post("/api/actions/dig/hitWall")
    }

    /**
     * Prepare for garbage collection
     */
    public kill() {
        this.off("mouseover", this.mouseOver_fct)

        cell.app.stage.off("mousemove", this.mouseMove_fct)

        cell.app.ticker.remove(this.follow_fct)
        cell.app.ticker.remove(this.checkRevealItem_fct)

        this.parent.removeChild(this)
    }
}

export default User;