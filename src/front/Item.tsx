import * as React from "react"
import { ItemModel } from "../back/item/model";

class Item extends React.Component {

    public props: {
        item?: ItemModel | { x: number, y: number },
        user_item?: { _id?: any, ammo?: number, item: ItemModel },
        active?: boolean,
        still?: boolean
    }

    constructor(props: ItemModel) {
        super(props)
    }

    public render() {

        let className = `bg-x${this.position.x} bg-y${this.position.y} `

        if (this.props.active !== false) {
            className += "active "
        }

        if (this.props.still === true) {
            className += "item_img-still"
        } else {
            className += "item_img"
        }

        return (
            <i className={className}></i>
        )
    }

    /**
     * Get the position in the big items picture depending if we got an item or a user_item
     */
    private get position(): { x: number, y: number } {
        var src = this.props.item;
        if (this.props.user_item !== undefined) {
            src = this.props.user_item.item
        }
        return { x: src.x, y: src.y }
    }
}

export default Item