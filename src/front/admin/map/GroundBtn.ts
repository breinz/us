import AButton from "./AButton";

export default class GroundBtn extends AButton {

    private index: number;

    static labels: string[] = ["grass", "desert", "snow", "water", "volcano"];
    static colors: number[] = [0x88c083, 0xc9c29e, 0xdee5eb, 0x7ea4bf, 0xbc4f4f];

    public color: number;
    public label: string;

    constructor(index: number) {
        super()

        this.index = index;

        this.action = "ground";

        this.color = GroundBtn.colors[index];
        this.label = GroundBtn.labels[index].substr(0, 1);

        this.draw()
    }

    protected draw() {
        super.draw();

        let color = new PIXI.Graphics();
        color.beginFill(this.color).drawRect(5, 5, 20, 20)
        this.addChild(color);

        let text = new PIXI.Text(GroundBtn.labels[this.index], AButton.txt_opt)
        text.x = 30;
        text.y = 7;
        this.addChild(text)
    }

}