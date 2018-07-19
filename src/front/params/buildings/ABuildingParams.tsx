import * as React from "react"
import dispatcher from "../../dispatcher";
import i18n from "../../i18n";
import { cell } from "../../main";

class ABuildingParams extends React.Component {

    private onSleep_fct: () => void;

    constructor(props: any) {
        super(props)

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
     * The user goes to sleep or wakes up
     * @param sleep If the user goes to sleep or wakes up
     */
    protected onSleep(sleep: boolean) {
        this.forceUpdate()
    }
}

export default ABuildingParams;