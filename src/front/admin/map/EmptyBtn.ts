import BuildingBtn from "./BuildingBtn";

export default class EmptyBtn extends BuildingBtn {
    constructor(label: string) {
        super(label)

        this.action = "empty";

        this.letter = "∅";

        //this.draw();
    }
}