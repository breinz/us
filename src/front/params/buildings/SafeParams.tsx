import * as React from "react"
import i18n from "../../i18n"
import { cell } from "../../main";
import ABuildingParams, { PropsType } from "./ABuildingParams";

class SafeParams extends ABuildingParams {

    public state: {
        error?: React.ReactElement<"div">
    }

    constructor(props: PropsType) {
        super(props)

        this.state = {
        }
    }

    componentDidMount() {
        //cell.cell_socket.on(message.WELL.GET_WATER.DOWN, this.updateRations_fct)

        super.componentDidMount()
    }

    componentWillUnmount() {
        //cell.cell_socket.off(message.WELL.GET_WATER.DOWN, this.updateRations_fct)

        super.componentWillUnmount()
    }

    public render() {
        let hidden_actions = 0;

        const asleep = cell.user_controller.state.resting

        let open_btn;
        if (!asleep) {
            open_btn =
                <button
                    onClick={() => this.doOpen(true)}
                    className="button success small">
                    {i18n.__("actions.open")}
                </button>;

        }

        return (
            <div>
                {this.state.error}
                <div>
                    {open_btn}
                </div>
                {this.getHiddenActions(hidden_actions)}
            </div>
        )
    }

    // --------------------------------------------------
    // Open
    // --------------------------------------------------

    private async doOpen(moveTo: boolean = false) {
        this.setState({ error: null })
        if (moveTo) {
            // Move to the well
            cell.user.moveTo(this.props.building.entry, this.doOpen.bind(this))
            return;
        }

        /*let res;
        try {
            res = await Axios.post("/api/actions/safe/open", {
                safeId: this.props.building.data._id
            })
        } catch{
            this.setState({
                error: <div className="error-box">Unexpected Error</div>
            })
            return;
        }*/

        let data = await this.api("/api/actions/safe/open", {
            safeId: this.props.building.data._id
        })

        if (this.handleError(data)) {
            return;
        }

        // Inform all users in that cell about the new rations number
        //cell.cell_socket.emit("addWater", res.data)

        // Update the user's bag
        //dispatcher.dispatch(dispatcher.UPDATE_BAG, res.data.bag)
    }
}

export default SafeParams