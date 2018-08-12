import { camelize, capitalize } from "underscore.string"
import AButton from "./AButton";

export default class BuildingBtn extends AButton {

    private label: string;

    constructor(label: string) {
        super()

        this.label = label;

        this.action = "building";

        this.draw();
    }

    protected draw() {
        super.draw();

        let letter = new PIXI.Text(this.label.substr(0, 1).toUpperCase(), {
            fontWeight: "bold", fontSize: 18
        })
        letter.x = 8;
        letter.y = 4;
        this.addChild(letter)

        let text = new PIXI.Text(capitalize(this.label), AButton.txt_opt)
        text.x = 30;
        text.y = 7;
        this.addChild(text)
    }


}