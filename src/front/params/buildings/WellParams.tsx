import * as React from "react"
import i18n from "../../i18n"
import { cell } from "../../main";
import dispatcher from "../../dispatcher";
import message from "../../../SocketMessages"
import ABuildingParams, { PropsType } from "./ABuildingParams";
import { Us } from "../../../us";

class WellParams extends ABuildingParams {

    public state: {
        rations: number,
        poison: number,
        error?: React.ReactElement<"div">
    }

    private updateRations_fct: (data: Us.Well.ApiResult.getWater) => void;
    private updatePoison_fct: (data: Us.Well.ApiResult.getWater) => void;

    constructor(props: PropsType) {
        super(props)

        this.state = {
            rations: this.props.building.data.rations,
            poison: this.props.building.data.poison
        }

        this.updateRations_fct = (data) => { this.updateRations(data.rations) };
        this.updatePoison_fct = (data) => { this.updatePoison(data.poison) };

    }

    componentDidMount() {
        cell.cell_socket.on(message.Well.GOT_WATER, this.updateRations_fct)
        cell.cell_socket.on(message.Well.GOT_WATER, this.updatePoison_fct)
        cell.cell_socket.on(message.Well.ADDED_WATER, this.updateRations_fct)
        cell.cell_socket.on(message.Well.POISONED, this.updatePoison_fct)

        super.componentDidMount()
    }

    componentWillUnmount() {
        cell.cell_socket.off(message.Well.GOT_WATER, this.updateRations_fct)
        cell.cell_socket.off(message.Well.GOT_WATER, this.updatePoison_fct)
        cell.cell_socket.off(message.Well.ADDED_WATER, this.updateRations_fct)
        cell.cell_socket.off(message.Well.POISONED, this.updatePoison_fct)

        super.componentWillUnmount()
    }

    public render() {
        let hidden_actions = 0;

        const asleep = cell.user_controller.state.resting

        // Get water btn
        let getWater_btn;
        if (!asleep && cell.user_controller.hasItem("bottle")) {
            getWater_btn =
                <button
                    onClick={() => { this.getWater() }}
                    className="button success small"
                    dangerouslySetInnerHTML={{ __html: i18n.__("actions.getWater") }}>
                </button>;
        } else {
            hidden_actions++;
        }

        // Add water btn
        let addWater_btn;
        if (!asleep && cell.user_controller.hasItem("bottle_full")) {
            addWater_btn =
                <button
                    onClick={() => { this.addWater() }}
                    className="button secondary hollow small"
                    dangerouslySetInnerHTML={{ __html: i18n.__("actions.addWater") }}>
                </button>
        } else {
            hidden_actions++
        }

        // Poison btn
        let poison_btn;
        if (!asleep && cell.user_controller.hasItem("poison")) {
            poison_btn =
                <button
                    onClick={() => { this.poison() }}
                    className="button secondary hollow small"
                    dangerouslySetInnerHTML={{ __html: i18n.__("actions.poison") }}>
                </button>;
        } else {
            hidden_actions++
        }

        return (
            <div>
                <div className="bignum">
                    <div className="num">{this.state.rations}</div>
                    rations
                </div>
                {this.state.error}
                <div>
                    {getWater_btn}
                    {addWater_btn}
                    {poison_btn}
                </div>
                {this.getHiddenActions(hidden_actions)}
            </div>
        )
    }

    // --------------------------------------------------
    // Rations
    // --------------------------------------------------

    /**
     * Get water from the well
     * @param moveTo If we make the user move close to the well
     */
    private async getWater(moveTo: boolean = true) {
        this.setState({ error: null })
        if (moveTo) {
            // Move to the well
            cell.user.moveTo(this.props.building.entry, () => { this.getWater(false) })
            return;
        }

        //let data: { success: boolean, bag?: UserItemModel[], error?: string, fatal?: string };

        let data: Us.Well.ApiResult.getWater = await this.post("/api/actions/well/getWater", {
            wellId: this.props.building.data._id
        });

        if (this.handleError(data)) {
            return;
        }

        // Inform all users in that cell about the new rations number
        cell.cell_socket.emit(message.Well.GET_WATER, data)

        // Update the user's bag
        dispatcher.dispatch(dispatcher.UPDATE_BAG, data.bag)
    }

    /**
     * Add water to the well
     * @param moveTo Is the user has to move close to the well
     */
    private async addWater(moveTo: boolean = true) {
        this.setState({ error: null })
        if (moveTo) {
            // Move to the well
            cell.user.moveTo(this.props.building.entry, () => { this.addWater(false) })
            return;
        }

        let data = await this.post("/api/actions/well/addWater", {
            wellId: this.props.building.data._id
        })

        if (this.handleError(data)) {
            return;
        }

        // Inform all users in that cell about the new rations number
        cell.cell_socket.emit("addWater", data)

        // Update the user's bag
        dispatcher.dispatch(dispatcher.UPDATE_BAG, data.bag)

    }

    /**
     * Someone took water from that well
     * @param rations The number of rations left
     */
    private updateRations(rations: number) {
        this.setState({ rations: rations })
    }

    // --------------------------------------------------
    // Poison
    // --------------------------------------------------

    /**
     * Poison the well
     * @param moveTo If the user has to move close to the well
     */
    private async poison(moveTo: boolean = true) {
        this.setState({ error: null })

        // Move to the well
        if (moveTo) {
            cell.user.moveTo(this.props.building.entry, () => { this.poison(false) })
            return;
        }

        let data = await this.post("/api/actions/well/poison", {
            wellId: this.props.building.data._id
        })

        if (this.handleError(data)) {
            return;
        }

        // Inform all users that this well is poisoned
        cell.cell_socket.emit(message.Well.POISON, data)

        // Update the user's bag
        dispatcher.dispatch(dispatcher.UPDATE_BAG, data.bag)
    }

    /**
     * The well was poisoned
     * @param poison The number of poisoned rations in the well
     */
    private updatePoison(poison: number) {
        this.setState({ poison: poison })
    }
}

export default WellParams