import * as React from "react"
import Axios from "axios"
import { BuildingData } from "../../buildings/BuildingFactory";
import i18n from "../../i18n"
import { cell } from "../../main";
import ABuilding from "../../buildings/ABuilding";
import dispatcher from "../../dispatcher";

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
        cell.cell_socket.on("gotWater", this.updateRations_fct)
        cell.cell_socket.on("gotWater", this.updatePoison_fct)
        cell.cell_socket.on("addedWater", this.updateRations_fct)
        cell.cell_socket.on("well.poisoned", this.updatePoison_fct)

        dispatcher.on(dispatcher.SLEEP, this.onSleep_fct)
    }

    componentWillUnmount() {
        cell.cell_socket.off("gotWater", this.updateRations_fct)
        cell.cell_socket.off("gotWater", this.updatePoison_fct)
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
                    onClick={this.getWater.bind(this)}
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
                    onClick={this.addWater.bind(this)}
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

    private onSleep(sleep: boolean) {
        this.forceUpdate()
    }

    private getWater() {
        this.setState({ error: null })

        // Move to the well
        cell.user.moveTo(this.props.building.entry, this.doGetWater.bind(this))
    }

    private async doGetWater() {
        let res;

        try {
            res = await Axios.post("/api/actions//well/getWater", {
                wellId: this.props.building.data._id
            })
        } catch (error) {
            return this.setState({
                error: <div className="error-box">Unexpected Error</div>
            })
        }

        // Unexpected Error
        if (res.data.fatal) {
            return this.setState({
                error: <div className="error-box">Unexpected Error</div>
            })
        }

        // Error (cannot take water)
        if (res.data.error) {
            this.setState({
                error: <div className="error-box">{i18n.__(`errors.${res.data.error}`)}</div>
            })
            return;
        }

        // Inform all users in that cell about the new rations number
        cell.cell_socket.emit("getWater", res.data)

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

    /**
     * The well was poisoned
     * @param data Data
     */
    private updatePoison(data: { poison: number }) {
        this.setState({ poison: data.poison })
    }

    private addWater() {
        this.setState({ error: null })
        // Move to the well
        cell.user.moveTo(this.props.building.entry, this.doAddWater.bind(this))
    }

    private async doAddWater() {
        let res = await Axios.post("/api/actions/well/addWater", {
            wellId: this.props.building.data._id
        })

        // Unexpected Error
        if (res.data.fatal) {
            console.error(res.data.fatal);
            return this.setState({
                error: <div className="error-box">Unexpected Error</div>
            })
        }

        // Error (cannot add water)
        if (res.data.error) {
            this.setState({
                error: <div className="error-box">{i18n.__(`errors.${res.data.error}`)}</div>
            })
            return;
        }

        // Inform all users in that cell about the new rations number
        cell.cell_socket.emit("addWater", res.data)

        // Update the user's bag
        dispatcher.dispatch(dispatcher.UPDATE_BAG, res.data.bag)

    }

    private async poison(isClose: boolean = false) {
        this.setState({ error: null })

        console.log("isClose", isClose);
        // Move to the well
        if (!isClose) {
            console.log("moveTo");

            cell.user.moveTo(this.props.building.entry, () => { this.poison(true) })
            return;
        }

        let res = await Axios.post("/api/actions/well/poison", {
            wellId: this.props.building.data._id
        })

        if (this.manageError(res.data)) return;

        // Inform all users that this well is poisoned
        cell.cell_socket.emit("well.poison", res.data)

        // Update the user's bag
        dispatcher.dispatch(dispatcher.UPDATE_BAG, res.data.bag)
    }

    /**
     * Manage Axios error
     * @param data The return data from Axios
     * @return Boolean An error occurred or not
     */
    private manageError(data: any) {
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