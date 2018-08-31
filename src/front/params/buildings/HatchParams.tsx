import * as React from "react"
import i18n from "../../i18n"
import { cell } from "../../main";
import ABuildingParams, { PropsType } from "./ABuildingParams";


class HatchParams extends ABuildingParams {

    constructor(props: PropsType) {
        super(props)
    }

    public render() {
        let hidden_actions = 0;

        let dig_btn;
        if (!this.asleep) {
            dig_btn =
                <button
                    onClick={() => { this.onDig(true) }}
                    className="button success small"
                    dangerouslySetInnerHTML={{ __html: i18n.__("actions.dig.action") }}>
                </button>;
        } else {
            hidden_actions++;
        }

        return (
            <div>
                {this.state.error}
                <div>
                    {dig_btn}
                </div>
                {this.getHiddenActions(hidden_actions)}
            </div>
        )
    }

    private onDig(moveTo: boolean) {
        this.setState({ error: null })
        if (moveTo) {
            // Move to the well
            cell.user.moveTo(this.props.building.entry, this.onDig.bind(this))
            return;
        }
    }
}

export default HatchParams