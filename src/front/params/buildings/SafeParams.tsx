import * as React from "react"
import i18n from "../../i18n"
import { cell } from "../../main";
import ABuildingParams, { PropsType } from "./ABuildingParams";
import messages from "../../../SocketMessages";
import { ITEMS } from "../../../const";
import { SAFE_API } from "../../buildings/Safe";
import { timer_toString } from "../../../helper";


class SafeParams extends ABuildingParams {

    public state: {
        error?: React.ReactElement<"div">,
        refill: number
    }

    private timer: number;

    constructor(props: PropsType) {
        super(props)

        this.state = {
            refill: this.isOpen() ? 30 : null
        }
    }

    componentDidMount() {
        //cell.cell_socket.on(message.WELL.GET_WATER.DOWN, this.updateRations_fct)
        this.timer = setInterval(this.updateRefillTime.bind(this), 1000)

        super.componentDidMount()
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        //cell.cell_socket.off(message.WELL.GET_WATER.DOWN, this.updateRations_fct)

        super.componentWillUnmount()
    }

    public render() {
        let hidden_actions = 0;

        const asleep = cell.user_controller.state.resting

        let open_btn;
        if (!asleep) {

            // --------------------------------------------------
            // Open
            if (this.isOpen()) {
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

        // --------------------------------------------------
        // Refill
        let refill = null;
        if (this.isOpen()) {
            refill = <div className="bignum">
                <div className="num">{this.refil_time}</div>
                refill
            </div>
        }

        return (
            <div>
                {this.state.error}
                {refill}
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

    /**
     * Has this safe been opened
     */
    private isOpen(): boolean {
        if (!this.props.building.data.visited) {
            return false;
        }
        if (this.props.building.data.visited.length === 0) {
            return false;
        }
        const at: Date = new Date(this.props.building.data.visited[this.props.building.data.visited.length - 1].at);
        if (at > new Date(Date.now() - ITEMS.SAFE.REFILL_DELAY)) {
            return true;
        }

        return false;
    }

    private get refil_time(): string {
        let at = new Date(this.props.building.data.visited[this.props.building.data.visited.length - 1].at)
        at = new Date(at.getTime() + ITEMS.SAFE.REFILL_DELAY);

        return timer_toString(at)
    }

    private updateRefillTime() {
        this.forceUpdate();
    }

    /**
     * Open
     * @param moveTo 
     */
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