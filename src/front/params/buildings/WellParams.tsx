import * as React from "react"
import Axios from "axios"
import { BuildingData } from "../../buildings/BuildingFactory";
import i18n from "../../i18n"
import { cell } from "../../main";
import ABuilding from "../../buildings/ABuilding";
import dispatcher from "../../dispatcher";
import message from "../../../SocketMessages"

type PropsType = {
    building: ABuilding
}

class WellParams extends React.Component {


    public props: PropsType;

    public state: {
        rations: number,
        poison: number,
        error?: React.ReactElement<"div">,
    }

    private updateRations_fct: () => void
    private updatePoison_fct: () => void
    private onSleep_fct: () => void;

    constructor(props: PropsType) {
        super(props)

        this.state = {
            rations: this.props.building.data.rations,
            poison: this.props.building.data.poison
        }

        this.updateRations_fct = this.updateRations.bind(this)
        this.onSleep_fct = this.onSleep.bind(this)
        this.updatePoison_fct = this.updatePoison.bind(this);

    }

    componentDidMount() {
        cell.cell_socket.on(message.WELL.GET_WATER.DOWN, this.updateRations_fct)
        cell.cell_socket.on(message.WELL.GET_WATER.DOWN, this.updatePoison_fct)
        cell.cell_socket.on("addedWater", this.updateRations_fct)
        cell.cell_socket.on("well.poisoned", this.updatePoison_fct)

        dispatcher.on(dispatcher.SLEEP, this.onSleep_fct)
    }

    componentWillUnmount() {
        cell.cell_socket.off(message.WELL.GET_WATER.DOWN, this.updateRations_fct)
        cell.cell_socket.off(message.WELL.GET_WATER.DOWN, this.updatePoison_fct)
        cell.cell_socket.off("addedWater", this.updateRations_fct)
        cell.cell_socket.off("well.poisoned", this.updatePoison_fct)

        dispatcher.off(dispatcher.SLEEP, this.onSleep_fct)
    }

    public render() {
        let hidden_actions = 0;

        const asleep = cell.user_controller.state.resting

        // Get water btn
        let getWater_btn;
        if (!asleep && cell.user_controller.hasItem("bottle")) {
            getWater_btn =
                <button
                    onClick={() => { this.getWater(true) }}
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
                    onClick={() => { this.addWater(true) }}
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
                    onClick={() => { this.poison(true) }}
                    className="button secondary hollow small"
                    dangerouslySetInnerHTML={{ __html: i18n.__("actions.poison") }}>
                </button>;
        } else {
            hidden_actions++
        }

        // Hidden actions
        let hidden_actions_txt
        if (hidden_actions > 0) {
            hidden_actions_txt =
                <small>
                    {i18n._n("actions.%s more", hidden_actions)}
                </small>;
        }

        return (
            <div>
                <div className="bignum">
                    <div className="num">{this.state.rations}</div>
                    rations
                </div>
                <div className="bignum">
                    <div className="num">{this.state.poison}</div>
                    poison
                </div>
                {this.state.error}
                <div>
                    {getWater_btn}
                    {addWater_btn}
                    {poison_btn}
                </div>
                {hidden_actions_txt}
            </div>
        )
    }

    /**
     * The user goes to sleep or wakes up
     * @param sleep If the user goes to sleep or wakes up
     */
    private onSleep(sleep: boolean) {
        this.forceUpdate()
    }

    // --------------------------------------------------
    // Rations
    // --------------------------------------------------

    /**
     * Get water from the well
     * @param moveTo If we make the user move close to the well
     */
    private async getWater(moveTo: boolean = false) {
        this.setState({ error: null })
        if (moveTo) {
            // Move to the well
            cell.user.moveTo(this.props.building.entry, this.getWater.bind(this))
            return;
        }

        let res;

        res = await Axios.post("/api/actions//well/getWater", {
            wellId: this.props.building.data._id
        })

        if (this.handleError(res.data)) {
            return;
        }

        // Inform all users in that cell about the new rations number
        cell.cell_socket.emit(message.WELL.GET_WATER.UP, res.data)

        // Update the user's bag
        dispatcher.dispatch(dispatcher.UPDATE_BAG, res.data.bag)
    }

    /**
     * Add water to the well
     * @param moveTo Is the user has to move close to the well
     */
    private async addWater(moveTo: boolean = false) {
        this.setState({ error: null })
        if (moveTo) {
            // Move to the well
            cell.user.moveTo(this.props.building.entry, this.addWater.bind(this))
            return;
        }

        let res = await Axios.post("/api/actions/well/addWater", {
            wellId: this.props.building.data._id
        })

        if (this.handleError(res.data)) {
            return;
        }

        // Inform all users in that cell about the new rations number
        cell.cell_socket.emit("addWater", res.data)

        // Update the user's bag
        dispatcher.dispatch(dispatcher.UPDATE_BAG, res.data.bag)

    }

    /**
     * Someone took water from that well
     * @param data Data
     */
    private updateRations(data: { rations: number }) {
        this.setState({ rations: data.rations })
    }

    // --------------------------------------------------
    // Poison
    // --------------------------------------------------

    /**
     * Poison the well
     * @param moveTo If the user has to move close to the well
     */
    private async poison(moveTo: boolean = false) {
        this.setState({ error: null })

        // Move to the well
        if (moveTo) {
            cell.user.moveTo(this.props.building.entry, this.poison.bind(this))
            return;
        }

        let res = await Axios.post("/api/actions/well/poison", {
            wellId: this.props.building.data._id
        })

        if (this.handleError(res.data)) {
            return;
        }

        // Inform all users that this well is poisoned
        cell.cell_socket.emit("well.poison", res.data)

        // Update the user's bag
        dispatcher.dispatch(dispatcher.UPDATE_BAG, res.data.bag)
    }

    /**
     * The well was poisoned
     * @param data Data
     */
    private updatePoison(data: { poison: number }) {
        this.setState({ poison: data.poison })
    }

    /**
     * Manage Axios error
     * @param data The return data from Axios
     * @return Boolean An error occurred or not
     */
    private handleError(data: any) {
        // Unexpected Error
        if (data.fatal) {
            console.error(data.fatal);
            this.setState({
                error: <div className="error-box">Unexpected Error</div>
            })
            return true
        }

        // Error (cannot add water)
        if (data.error) {
            this.setState({
                error: <div className="error-box">{i18n.__(`errors.${data.error}`)}</div>
            })
            return true;
        }

        return false;
    }
}

export default WellParams