import * as React from "react"
import Axios from "axios"
import { BuildingData } from "../../buildings/BuildingFactory";
import i18n from "../../i18n"
import { cell } from "../../main";
import ABuilding from "../../buildings/ABuilding";
import dispatcher from "../../dispatcher";
import message from "../../../SocketMessages"
import ABuildingParams from "./ABuildingParams";

type PropsType = {
    building: ABuilding
}

class ChurchParams extends ABuildingParams {


    public props: PropsType;

    public state: {
        error?: React.ReactElement<"div">,
    }

    constructor(props: PropsType) {
        super(props)

        this.state = {
        }
    }

    componentDidMount() {
        super.componentDidMount()
    }

    componentWillUnmount() {
        super.componentWillUnmount()
    }

    public render() {
        let hidden_actions = 0;

        let enter_btn;
        if (!this.asleep) {
            enter_btn =
                <button
                    onClick={() => { this.onEnter(true) }}
                    className="button success small"
                    dangerouslySetInnerHTML={{ __html: i18n.__("actions.enter") }}>
                </button>;
        } else {
            hidden_actions++;
        }

        return (
            <div>
                {this.state.error}
                <div>
                    {enter_btn}
                </div>
                {this.getHiddenActions(hidden_actions)}
            </div>
        )
    }

    private onEnter(moveTo: boolean) {
        this.setState({ error: null })
        if (moveTo) {
            // Move to the well
            cell.user.moveTo(this.props.building.entry, this.onEnter.bind(this))
            return;
        }
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

export default ChurchParams