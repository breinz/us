import AButton from "./AButton";
import { GROUND } from "../../../const";

export default class GroundBtn extends AButton {

    private index: number;

    public color: number;
    public label: string;

    constructor(index: number) {
        super()

        this.index = index;

        this.action = "ground";

        this.color = GROUND.COLORS[index]
        this.label = GROUND.LABELS[index].substr(0, 1);

        //this.draw()
    }

    protected draw() {
        super.draw();

        let color = new PIXI.Graphics();
        color.beginFill(this.color).drawRect(5, 5, 20, 20)
        this.addChild(color);

        let text = new PIXI.Text(GROUND.LABELS[this.index], AButton.txt_opt)
        text.x = 30;
        text.y = 7;
        this.addChild(text)
    }

}