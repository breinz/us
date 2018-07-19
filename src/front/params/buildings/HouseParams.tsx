import * as React from "react"
import { BuildingData } from "../../buildings/BuildingFactory";
import i18n from "../../i18n"
import ABuilding from "../../buildings/ABuilding";
import { cell } from "../../main";
import dispatcher from "../../dispatcher";
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

    constructor(props: BuildingData) {
        super(props)
    }

    public render() {
        let hidden_actions = 0;

        // Rest
        let rest_btn
        if (!cell.user_controller.state.resting) {
            rest_btn =
                <button onClick={() => { this.rest(true) }} className="button success small">
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

    // --------------------------------------------------
    // Rest
    // --------------------------------------------------

    /**
     * Rest in this place
     * @param moveTo If we need to move the user to that place
     */
    private rest(moveTo: boolean) {
        if (moveTo) {
            cell.user.moveTo(this.props.building.entry, this.rest.bind(this))
            return;
        }
        dispatcher.dispatch(dispatcher.REST, 5)
    }

}

export default HouseParams