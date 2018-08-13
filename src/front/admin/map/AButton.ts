import dispatcher from "../../dispatcher";

export default class AButton extends PIXI.Container {

    public action: string;

    static click = "admin_map_aButton_click";
    static txt_opt: PIXI.TextStyleOptions = {
        fontFamily: "noto sans, lucida grande, lucida sans unicode, Geneva, Verdana, sans - serif",
        fontSize: 12
    };

    protected bg: PIXI.Graphics;
    protected selected: boolean = false;

    constructor() {
        super();

        this.interactive = true;
        this.on("mouseover", this.onMouseOver.bind(this))
        this.on("mouseout", this.onMouseOut.bind(this))
        this.on("click", this.onClick.bind(this))

        dispatcher.on(AButton.click, this.onClicked.bind(this))

        this.on("added", () => { this.draw() })
    }

    protected draw() {
        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0xFFFFFF);
        this.bg.drawRect(0, 0, 100, 30)
        this.bg.alpha = 0;
        this.addChild(this.bg)
    }

    private onMouseOver() {
        if (this.selected) return;
        this.bg.alpha = .5;
    }

    private onMouseOut() {
        if (this.selected) return;
        this.bg.alpha = 0;
    }

    private onClick() {
        dispatcher.dispatch(AButton.click, this)
    }

    protected onClicked(target: AButton) {
        this.selected = target === this;
        this.bg.alpha = target === this ? 1 : 0;
    }
}