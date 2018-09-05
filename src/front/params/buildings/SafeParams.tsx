import * as React from "react"
import i18n from "../../i18n"
import { cell } from "../../main";
import ABuildingParams, { PropsType } from "./ABuildingParams";
import Safe, { SAFE_API } from "../../buildings/Safe";
import messages from "../../../SocketMessages";
import { ItemModel } from "../../../back/item/model";


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

            if (this.isOpen() && false) {
                hidden_actions++;
            } else {
                open_btn =
                    <button
                        onClick={() => this.doOpen(true)}
                        className="button success small">
                        {i18n.__("actions.open")}
                    </button>;
            }

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

    private isOpen(): boolean {
        if (!this.props.building.data.visited) {
            return false;
        }
        if (this.props.building.data.visited.length === 0) {
            return false;
        }
        const at: Date = new Date(this.props.building.data.visited[this.props.building.data.visited.length - 1].at);
        if (at > new Date(Date.now() - Safe.REFILL_DELAY)) {
            return true;
        }

        return false;
    }

    private async doOpen(moveTo: boolean = false) {
        this.setState({ error: null })
        if (moveTo) {
            // Move to the well
            cell.user.moveTo(this.props.building.entry, this.doOpen.bind(this))
            return;
        }

        const data: SAFE_API["OPEN"] = await this.post("/api/actions/buildings/safe/open", {
            safeId: this.props.building.data._id
        });

        console.log(data);

        if (this.handleError(data)) {
            return;
        }

        cell.cell_socket.emit(messages.SAFE.OPEN.UP, data)

        // ==> data.item is the item in the safe

        // Inform all users in that cell about the new rations number
        //cell.cell_socket.emit("addWater", res.data)

        // Update the user's bag
        //dispatcher.dispatch(dispatcher.UPDATE_BAG, res.data.bag)
    }
}

export default SafeParams