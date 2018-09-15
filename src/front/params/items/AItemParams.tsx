import * as React from "react"
import { IItemParams } from "./IItemParams";
import i18n from "../../i18n";
import ItemParams, { StateType } from "../ItemParams";
import { CellItemModel } from "../../../back/cell/model";
import { UserItemModel } from "../../../back/user/model";
import dispatcher from "../../dispatcher";
import post from "../../api";
import { Us } from "../../../us";
import { cell } from "../../main";
import messages from "../../../SocketMessages";

export default class AItemParams implements IItemParams {

    /**
     * The component
     */
    protected component: ItemParams;

    /**
     * The item
     */
    protected item: UserItemModel | CellItemModel;

    /**
     * Hidden actions
     */
    protected hidden_actions: number;

    constructor(ref: ItemParams) {
        this.component = ref;
        this.item = ref.props.item;
    }

    /**
     * @inheritdoc
     */
    public getInfos(state: StateType): React.ReactElement<"div"> {
        if (this.isCellItem()) {
            return this.cellInfos(state);
        }
        return this.bagInfos(state);
    }

    /**
     * @inheritdoc
     */
    public getButtons(state: StateType): React.ReactElement<"div"> {
        if (this.isCellItem()) {
            return this.cellButtons(state);
        }
        if (this.component.state.origin === "equipped") {
            return this.equippedButtons(state);
        }
        return this.bagButtons(state);
    }

    protected cellInfos(state: StateType): React.ReactElement<"div"> {
        return null;
    }

    protected bagInfos(state: StateType): React.ReactElement<"div"> {
        return null;
    }

    protected cellButtons(state: StateType): React.ReactElement<"div"> {
        return (
            <button className="button success small" onClick={() => this.grab()}>
                {i18n.__("actions.items.grab")}
            </button>
        );
    }

    protected bagButtons(state: StateType): React.ReactElement<"div"> {
        return <small>{i18n.__("actions.items.useless")}</small>
        //return null;
    }

    protected equippedButtons(state: StateType): React.ReactElement<"div"> {
        return <small>{i18n.__("actions.items.useless")}</small>
        //return null;
    }

    /**
     * Display how many hidden actions are available
     */
    protected getHiddenActions() {
        if (this.hidden_actions === 0) return null;
        return (
            <small>
                {i18n._n("actions.%s more", this.hidden_actions)}
            </small>
        );
    }

    /**
     * Is the item a CellItemModel
     * @return boolean
     */
    protected isCellItem(): boolean {
        return this.component.props.item.hasOwnProperty("x");
    }

    /**
     * Handle an error from an axios call
     * Can be either "fatal" (internal error) or "error" (game error)
     * @param data The data back from axios
     * @return boolean Did an error occurred
     */
    protected handleError(data: any): boolean {
        if (data.dead === true) {
            window.location.href = "/dead"
            return true;
        }

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

    /**
     * Clear any error
     */
    protected clearError() {
        this.component.setState({ error: null });
    }

    private displayError(message: string) {
        this.component.setState({
            error: <div className="error-box">{i18n.__(`errors.${message}`)}</div>
        })
    }

    /**
     * Grab
     */
    private async grab(moveTo: boolean = true) {
        this.clearError();

        if (moveTo) {
            const cellItem = this.component.props.item as CellItemModel;
            cell.user.moveTo({ x: cellItem.x, y: cellItem.y }, () => this.grab(false));
            return;
        }

        const data: Us.Items.ApiResult.grab = await post("/api/actions/items/grab", {
            cellItem_id: this.component.props.item._id
        })

        if (this.handleError(data)) return;

        dispatcher.dispatch(dispatcher.UPDATE_BAG, data.bag);
        dispatcher.dispatch(dispatcher.ITEM_GRABBED, this.component.props.item)
        cell.cell_socket.emit(messages.Item.GRAB, this.component.props.item)
    }

    /**
     * Equip
     */
    protected async equip() {
        this.clearError();

        const data: Us.Items.ApiResult.equip = await post("/api/actions/items/equip", {
            bagItem_id: this.component.props.item._id
        })

        if (this.handleError(data)) {
            return;
        }

        this.component.setState({ origin: "equipped" })

        dispatcher.dispatch(dispatcher.UPDATE_BAG, data.items.bag)
        dispatcher.dispatch(dispatcher.UPDATE_EQUIPPED, data.items.equipped);
    }
}