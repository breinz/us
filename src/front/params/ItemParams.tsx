import * as React from "react";

import { UserItemModel } from "../../back/user/model";
import i18n from "../i18n";
import Item from "../Item";
import Axios from "axios";
import dispatcher from "../dispatcher";
import { cell } from "../main";

type PropsType = {
    item: UserItemModel
}

export default class ItemParams extends React.Component {

    public props: PropsType;

    public state: {
        error: React.ReactElement<"div">,
        ammo?: number
    }

    constructor(props: PropsType) {
        super(props)

        this.state = {
            error: null,
            ammo: this.props.item.ammo
        }
    }

    /**
     * When another item is selected
     * @param props The new props
     */
    public componentWillReceiveProps(props: PropsType) {
        if (props.item._id === this.props.item._id) return;
        this.setState({
            error: null,
            ammo: props.item.ammo
        })
    }

    public render() {
        return (<div>
            {this.state.error}
            {this.getInfos()}
            {this.getButtons()}
        </div>)
    }

    private getInfos(): React.ReactElement<"div"> {
        switch (this.props.item.item.name) {
            case "pistol":
                return (
                    <div className="bignum">
                        <div className="num">{this.state.ammo}</div>
                        munitions
                    </div>
                )
        }
    }

    private getButtons(): React.ReactElement<"div" | "button"> {
        switch (this.props.item.item.name) {
            case "bottle_full":
                return (
                    <button className="button success small" onClick={this.drink.bind(this)} dangerouslySetInnerHTML={{ __html: i18n.__("actions.items.drink") }
                    }></button>
                )
            case "string":
                return (
                    <button className="button success small" onClick={this.assemble.bind(this)}>
                        <Item item={{ x: 1, y: 0 }} active={false} />{i18n.__("actions.items.assemble")}
                    </button>
                )
            case "pistol":
                return (
                    <div>
                        <button className="button success small" onClick={this.assemble.bind(this)}>
                            {i18n.__("actions.items.equip")}
                        </button>
                        <button className="button secondary hollow small" onClick={this.reload.bind(this)} dangerouslySetInnerHTML={{ __html: i18n.__("actions.items.reload") }}></button>
                    </div>
                )
            default:
                return <div>{i18n.__("actions.items.useless")}</div>
        }
    }

    /**
     * Drink from a bottle_full
     */
    private async drink() {
        let res = await Axios.post("/api/actions/drink", { item: this.props.item })

        if (this.handleError(res.data)) {
            return;
        }

        // Update bag
        dispatcher.dispatch(dispatcher.UPDATE_BAG, res.data.bag)

        // Select empty bottle
        dispatcher.dispatch(dispatcher.SELECT_ITEM,
            cell.user_data.items.find(item => { return item.item.name === "bottle" })
        )
    }

    private assemble() {
        console.log("assemble");
    }

    /**
     * Reload
     */
    private async reload() {
        let res = await Axios.post("/api/actions/reload", { user_pistol_id: this.props.item._id })

        if (this.handleError(res.data)) {
            return;
        }

        this.setState({ ammo: res.data.ammo })

        cell.user_controller.usePA();

        dispatcher.dispatch(dispatcher.UPDATE_BAG, res.data.bag)
    }

    /**
     * Handle an error from an axios call
     * Can be either "fatal" (internal error) or "error" (game error)
     * @param data The data back from axios
     * @return boolean Did an error occurred
     */
    private handleError(data: any): boolean {
        if (data.fatal) {
            console.error(data.error);
            this.displayError("fatal")
            return true
        }

        if (data.error) {
            this.displayError(data.error)
            return true;
        }
        return false
    }

    private displayError(message: string) {
        this.setState({
            error: <div className="error-box">{i18n.__(`errors.${message}`)}</div>
        })
    }
}