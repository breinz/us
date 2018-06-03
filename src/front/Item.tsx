import * as React from "react"
import { ItemModel } from "../back/item/model";

class Item extends React.Component {

    public props: {
        data: ItemModel
    }

    constructor(props: ItemModel) {
        super(props)
    }

    public render() {
        let className = `item_img bg-x${this.props.data.x} bg-y${this.props.data.y}`
        return (
            <i className={className}></i>
        )
    }
}

export default Item