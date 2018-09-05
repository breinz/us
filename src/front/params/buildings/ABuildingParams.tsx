import * as React from "react"
import dispatcher from "../../dispatcher";
import i18n from "../../i18n";
import { cell } from "../../main";
import ABuilding from "../../buildings/ABuilding";
import Axios from "axios";

export type PropsType = {
    building: ABuilding
}

class ABuildingParams extends React.Component {

    public props: PropsType;

    public state: {
        error?: React.ReactElement<"div">,
    }

    private onSleep_fct: () => void;

    constructor(props: PropsType) {
        super(props)

        this.state = {}

        this.onSleep_fct = this.onSleep.bind(this);
    }

    public componentDidMount() {
        dispatcher.on(dispatcher.SLEEP, this.onSleep_fct)
    }

    public componentWillUnmount() {
        dispatcher.off(dispatcher.SLEEP, this.onSleep_fct)
    }

    protected get asleep() {
        return cell.user_controller.state.resting;
    }

    /**
     * The "hidden actions" message
     * @param count How many hidden actions
     */
    protected getHiddenActions(count: number): React.ReactElement<"small"> {
        if (count <= 0) return null;

        return (
            <small>
                {i18n._n("actions.%s more", count)}
            </small>
        )
    }

    /**
     * Performs a post api call 
     * @param url Url
     * @param params Params
     */
    protected async post(url: string, params: object): Promise<any> {
        let res;
        try {
            res = await Axios.post(url, params);
        } catch (err) {
            return { fatal: err };
        }

        return res.data;
    }

    /**
     * Manage Axios error
     * @param data The return data from Axios
     * @return Boolean An error occurred or not
     */
    protected handleError(data: { success: boolean, error?: string, fatal?: string }) {
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

    /**
     * The user goes to sleep or wakes up
     * @param sleep If the user goes to sleep or wakes up
     */
    protected onSleep(sleep: boolean) {
        this.forceUpdate()
    }

    /**
     * Enter the building
     * @param moveTo If we want the user to move close the building's entry before entering
     */
    protected async onEnter(moveTo: boolean = true) {
        this.setState({ error: null })
        if (moveTo) {
            // Move to the well
            cell.user.moveTo(this.props.building.entry, () => { this.onEnter(false) })
            return;
        }

        cell.user.visible = false;

        let res = await Axios.post("/api/actions/buildings/enter", {
            building: this.props.building.data._id
        })

        if (!this.handleError(res.data)) {
            dispatcher.dispatch(dispatcher.ENTER, this.props.building)
        }
    }
}

export default ABuildingParams;