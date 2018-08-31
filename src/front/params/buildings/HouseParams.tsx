import * as React from "react"
import i18n from "../../i18n"
import ABuilding from "../../buildings/ABuilding";
import { cell } from "../../main";
import ABuildingParams from "./ABuildingParams";

type PropsType = {
    data: {
        _id?: any,
        building?: {
            name: string
        }
    },
    building: ABuilding
}

class HouseParams extends ABuildingParams {

    public props: PropsType;

    constructor(props: PropsType) {
        super(props)
    }

    public render() {
        let hidden_actions = 0;

        // Rest
        let rest_btn
        if (!cell.user_controller.state.resting) {
            rest_btn =
                <button onClick={() => { this.onEnter() }} className="button success small">
                    {i18n.__("actions.rest5")}
                </button>;
        } else {
            hidden_actions++;
        }

        return (
            <div>
                {rest_btn}
                {this.getHiddenActions(hidden_actions)}
            </div>
        )
    }

}

export default HouseParams