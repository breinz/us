import * as React from "react";
import { cell } from "../main";
import { ItemModel } from "../../back/item/model";
import Axios from "axios";
import dispatcher from "../dispatcher";

export default class Dev extends React.Component {

    public componentWillMount() {

    }

    public render() {

        let arItems = cell.items;

        let items: React.ReactElement<"a">[] = [];

        for (let i = 0; i < arItems.length; i++) {
            const element = arItems[i];
            items.push(
                <a href="#" key={element._id} onClick={() => { this.onClickItem(element); return null; }}>
                    <i className={`item_img active bg-x${element.x} bg-y${element.y}`}></i>
                </a>
            )
        }

        return (
            <div className="box">
                <div className="content">
                    <div className="itemList">
                        {items}
                    </div>
                    <button className="button small hollow secondary" onClick={this.clearBag.bind(this)}>
                        Clear bag
                    </button>
                </div>
            </div>
        )
    }

    private onClickItem(item: ItemModel) {
        Axios.post("/api/actions/grabItem", {
            from: "dev",
            item: item
        }).then(res => {
            dispatcher.dispatch(dispatcher.UPDATE_BAG, res.data.bag)
        }).catch(err => {
            console.error("/api/actions/grabItem")
        })
    }

    private async clearBag() {
        let res = await Axios.post("/api/dev/clearBag")

        dispatcher.dispatch(dispatcher.UPDATE_BAG, res.data.bag)
    }
}