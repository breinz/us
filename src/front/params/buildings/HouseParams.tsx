import * as React from "react"
import { BuildingData } from "../../buildings/BuildingFactory";
import i18n from "../../i18n"
import ABuilding from "../../buildings/ABuilding";
import { cell } from "../../main";
import dispatcher from "../../dispatcher";

type PropsType = {
    data: {
        _id?: any,
        building?: {
            name: string
        }
    },
    building: ABuilding
}

class HouseParams extends React.Component {

    public props: PropsType;

    private onSleep_fct: () => void;

    constructor(props: BuildingData) {
        super(props)

        this.onSleep_fct = this.onSleep.bind(this)
    }

    public componentWillMount() {
        dispatcher.on(dispatcher.SLEEP, this.onSleep_fct)
    }

    public componentWillUnmount() {
        dispatcher.off(dispatcher.SLEEP, this.onSleep_fct)
    }


    public render() {
        let hidden_actions = 0;

        // Rest
        let rest_btn
        if (!cell.user_controller.state.resting) {
            rest_btn =
                <button onClick={this.rest.bind(this)} className="button success small">
                    {i18n.__("actions.rest5")}
                </button>;
        } else {
            hidden_actions++;
        }

        // Hidden actions
        let hidden_actions_txt
        if (hidden_actions > 0) {
            hidden_actions_txt = <small>{i18n._n("actions.%s more", hidden_actions)}</small>
        }

        return (
            <div>
                {rest_btn}
                {hidden_actions_txt}
            </div>
        )
    }

    // --------------------------------------------------
    // Rest
    // --------------------------------------------------

    private rest() {

        cell.user.moveTo(this.props.building.entry, this.doRest.bind(this))

    }

    private doRest() {
        dispatcher.dispatch(dispatcher.REST, 5)
    }

    // --------------------------------------------------
    // Events
    // --------------------------------------------------

    private onSleep(sleep: boolean) {
        this.forceUpdate();
    }
}

export default HouseParams