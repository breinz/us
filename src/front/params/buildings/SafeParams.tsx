import * as React from "react"
import i18n from "../../i18n"
import { cell } from "../../main";
import ABuildingParams, { PropsType } from "./ABuildingParams";
import { ITEMS } from "../../../const";
import { timer_toString, D2R, R2D } from "../../../helper";
import { Us } from "../../../us";
import messages from "../../../SocketMessages";
import Item from "../../cell/Item";
import { TweenLite, Bounce, Quint, Linear } from "gsap";

class SafeParams extends ABuildingParams {

    public state: {
        error?: React.ReactElement<"div">,
        last_open_at: string
    }

    /**
     * The timer 
     */
    private timer: NodeJS.Timer;

    /**
     * Reference to function opened
     */
    private opened_fct: (params: Us.Safe.ApiResult.Open) => void;
    /**
     * Reference to function refilled
     */
    private refilled_fct: () => void;

    constructor(props: PropsType) {
        super(props)

        this.state = {
            last_open_at: this.open_at
        }

        this.opened_fct = (params: Us.Safe.ApiResult.Open) => this.opened(params);
        this.refilled_fct = () => this.refilled();
    }

    componentDidMount() {
        //cell.cell_socket.on(message.WELL.GET_WATER.DOWN, this.updateRations_fct)
        if (this.isOpen()) {
            this.startTimer()
        }

        cell.cell_socket.on(messages.Safe.OPENED, this.opened_fct);
        cell.cell_socket.on(messages.Safe.REFILLED, this.refilled_fct);

        super.componentDidMount()
    }

    componentWillUnmount() {
        clearInterval(this.timer);

        cell.cell_socket.off(messages.Safe.OPENED, this.opened_fct);
        cell.cell_socket.off(messages.Safe.REFILLED, this.refilled_fct);

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
     * Only to populate the initial state
     */
    private get open_at(): string {
        const visited = this.props.building.data.visited;
        if (!visited || visited === undefined || visited.length === 0) {
            return null;
        }
        return visited[visited.length - 1].at as string;
    }

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

    /**
     * Open the safe
     * @param moveTo 
     */
    private async doOpen(moveTo: boolean = true) {
        this.setState({ error: null })

        if (moveTo) {
            // Move to the building
            cell.user.moveTo(this.props.building.entry, () => { this.doOpen(false) })
            return;
        }

        const data: Us.Safe.ApiResult.Open = await this.post("/api/actions/buildings/safe/open", {
            safeId: this.props.building.data._id
        });

        if (this.handleError(data)) {
            return;
        }

        cell.cell_socket.emit(messages.Safe.OPEN, data)
    }

    /**
     * This safe has been opened
     * @param data Data
     */
    private opened(data: Us.Safe.ApiResult.Open) {
        this.setState({
            last_open_at: data.now
        })

        const container = new PIXI.Container();
        cell.app.stage.addChild(container);
        container.x = this.props.building.data.x + this.props.building.container.width / 2
        container.y = this.props.building.data.y;

        let item: Item = new Item(data.item);
        container.addChild(item);

        TweenLite.to(container, 1.3, {
            x: container.x + Math.cos(data.direction) * 70,// (Math.random() > .5 ? 70 : -70),
            y: container.y + Math.sin(data.direction) * 70,//20,
            ease: Linear.easeOut
        });
        TweenLite.to(item, .3, {
            y: item.x - 30,
            ease: Quint.easeOut,
            onComplete: () => {
                TweenLite.to(item, 1, {
                    y: item.x,
                    ease: Bounce.easeOut
                })
            }
        })

        this.startTimer()
    }

    // --------------------------------------------------
    // Refill
    // --------------------------------------------------

    /**
     * The timer value as displayed (HH:MM:SS)
     */
    private get refil_time(): string {
        let at = new Date(this.state.last_open_at)
        at = new Date(at.getTime() + ITEMS.SAFE.REFILL_DELAY);

        return timer_toString(at)
    }

    private refilled() {
        this.forceUpdate()
    }

    private updateRefillTime() {
        if (this.isOpen()) {
            this.forceUpdate();
        } else {
            clearInterval(this.timer)
        }
    }

    // --------------------------------------------------

    /**
     * Starts the timer, that ticks every second to update the refill time
     */
    private startTimer() {
        clearInterval(this.timer)
        this.timer = setInterval(() => { this.updateRefillTime() }, 1000)
    }
}

export default SafeParams