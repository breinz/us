export default class VContainer extends PIXI.Container {

    private padding: number;

    constructor(padding: number = 0) {
        super();

        this.padding = padding;
    }

    protected onChildrenChange = (...args: any[]) => {
        super.onChildrenChange(args)

        let h = 0;

        for (let i = 0; i < this.children.length; i++) {
            const c = this.children[i];
            c.y = h;
            h += c.getBounds().height + this.padding;
        }
    }

    public addSeparator(height: number) {
        const s = new PIXI.Graphics();
        s.beginFill(0, 0).drawRect(0, 0, 1, height);
        this.addChild(s);
    }
}