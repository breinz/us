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
        last_open_at: string
    }

    private timer: number;

    constructor(props: PropsType) {
        super(props)

        this.state = {
            last_open_at: this.open_at
        }
    }

    private get open_at(): string {
        const visited = this.props.building.data.visited;
        if (!visited || visited === undefined || visited.length === 0) {
            return null;
        }
        return visited[visited.length - 1].at as string;
    }

    componentDidMount() {
        //cell.cell_socket.on(message.WELL.GET_WATER.DOWN, this.updateRations_fct)
        this.timer = setInterval(this.updateRefillTime.bind(this), 1000)

        cell.cell_socket.on(messages.SAFE.OPEN.DOWN, (params: SAFE_API["OPEN"]) => { this.opened(params) });

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
                        onClick={() => this.doOpen()}
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
        if (!this.state.last_open_at) {
            return false;
        }
        const at: Date = new Date(this.state.last_open_at);
        if (at > new Date(Date.now() - ITEMS.SAFE.REFILL_DELAY)) {
            return true;
        }

        return false;
    }

    private get refil_time(): string {
        let at = new Date(this.state.last_open_at)
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
    private async doOpen(moveTo: boolean = true) {
        this.setState({ error: null })
        if (moveTo) {
            // Move to the building
            cell.user.moveTo(this.props.building.entry, () => { this.doOpen(false) })
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
    }

    private opened(data: SAFE_API["OPEN"]) {
        this.setState({
            last_open_at: data.now
        })
    }
}

export default SafeParams