import * as React from "react"
import Axios from "axios"
import { BuildingData } from "../../buildings/BuildingFactory";
import i18n from "../../i18n"
import { cell } from "../../main";
import ABuilding from "../../buildings/ABuilding";
import dispatcher from "../../dispatcher";
import message from "../../../SocketMessages"
import ABuildingParams, { PropsType } from "./ABuildingParams";

class ChurchParams extends ABuildingParams {

    constructor(props: PropsType) {
        super(props)
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
}

export default ChurchParams