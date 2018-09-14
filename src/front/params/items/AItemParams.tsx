import * as React from "react"
import { IItemParams } from "./IItemParams";
import i18n from "../../i18n";
import ItemParams, { StateType } from "../ItemParams";
import { CellItemModel } from "../../../back/cell/model";
import { UserItemModel } from "../../../back/user/model";

export default class AItemParams implements IItemParams {

    /**
     * The component
     */
    protected component: ItemParams;

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
        return null;
    }

    /**
     * @inheritdoc
     */
    public getButtons(state: StateType): React.ReactElement<"div"> {
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
}