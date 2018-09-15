import * as React from "react"
import { StateType } from ".";
import { cell } from "../../main";
import AItemParams from "./AItemParams";
import i18n from "../../i18n";
import Axios from "axios";
import dispatcher from "../../dispatcher";
import post from "../../api";
import { Us } from "../../../us";
import { StepTimingFunction } from "csstype";

export class PistolParams extends AItemParams {

    /**
     * @inheritdoc
     */
    protected bagInfos(state: StateType): React.ReactElement<"div"> {
        return (
            <div className="bignum">
                <div className="num">{state.ammo}</div>
                munitions
            </div>
        );
    }

    /**
     * @inheritdoc
     */
    protected bagButtons(state: StateType): React.ReactElement<"div"> {
        this.hidden_actions = 0;

        // --------------------------------------------------
        // Equip
        let equip =
            <button className="button success small" onClick={() => this.equip()}>
                {i18n.__("actions.items.equip")}
            </button>;

        // --------------------------------------------------
        // Reload
        let reload;
        if (this.component.state.ammo < 6 && cell.user_controller.hasItem("ammo")) {
            reload =
                <button
                    className="button secondary hollow small"
                    onClick={() => this.reload()}
                    dangerouslySetInnerHTML={{ __html: i18n.__("actions.items.reload") }}>
                </button>;
        } else {
            this.hidden_actions++;
        }

        return (
            <div>
                <div>
                    {equip}
                    {reload}
                </div>
                {this.getHiddenActions()}
            </div>
        )
    }

    protected equippedButtons(state: StateType): React.ReactElement<"div"> {
        this.hidden_actions = 0;

        // --------------------------------------------------
        // unequip
        let unequip = <button className="button warning small" onClick={() => this.unequip()}>
            {i18n.__("actions.items.unequip")}
        </button>;

        // --------------------------------------------------
        // Reload
        let reload;
        if (this.component.state.ammo < 6 && cell.user_controller.hasItem("ammo")) {
            reload =
                <button
                    className="button secondary hollow small"
                    onClick={() => this.reload()}
                    dangerouslySetInnerHTML={{ __html: i18n.__("actions.items.reload") }}>
                </button>;
        } else {
            this.hidden_actions++;
        }

        return (
            <div>
                <div>
                    {unequip}
                    {reload}
                </div>
                {this.getHiddenActions()}
            </div>
        )
    }

    private async unequip() {
        this.clearError();

        let data: Us.Items.ApiResult.equip = await post("/api/actions/items/unequip", {
            item_id: this.component.props.item._id
        })
        /*let res = await Axios.post("/api/actions/items/unequip", {
            item_id: this.props.item._id
        })*/

        if (this.handleError(data)) {
            return;
        }

        this.component.setState({ origin: "bag" })

        dispatcher.dispatch(dispatcher.UPDATE_BAG, data.items.bag)
        dispatcher.dispatch(dispatcher.UPDATE_EQUIPPED, data.items.equipped);
    }

    /**
     * Reload
     */
    private async reload() {
        this.clearError();

        const data: Us.Pistol.ApiResult.reload = await post("/api/actions/reload", {
            user_pistol_id: this.item._id
        })

        if (this.handleError(data)) {
            return;
        }

        dispatcher.dispatch(dispatcher.UPDATE_BAG, data.bag)

        this.component.setState({ ammo: data.ammo })

        cell.user_controller.usePA();
    }
}