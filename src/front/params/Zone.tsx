import * as React from "react"
import i18n from "../i18n"
import dispatcher from "../dispatcher";
import { cell } from "../main";

class Zone extends React.Component {

    private onSleep_fct: () => void;

    public constructor(props: any) {
        super(props);

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

        // Dig btn
        let dig_btn: React.ReactElement<"button">;
        if (!cell.user_controller.state.resting) {
            dig_btn =
                <button onClick={this.onDig} className="button success small" key="dig" dangerouslySetInnerHTML={{ __html: i18n.__("actions.dig.start") }}>
                </button>
        } else {
            hidden_actions++;
        }

        // Map btn
        const map_btn =
            <button onClick={this.showMap} className="button hollow small secondary" key="map">
                {i18n.__("actions.zone.showMap")}
            </button>;

        // Hidden actions
        let hidden_actions_txt: React.ReactElement<"small">
        if (hidden_actions > 0) {
            hidden_actions_txt = <small>{i18n._n("actions.%s more", hidden_actions)}</small>
        }

        return (
            <div>
                <div className="grid-x">
                    <div className="cell small-12">
                        <div className="bignum">
                            <div className="num">25</div>
                            degrees
                        </div>
                    </div>
                </div>

                <div>
                    {dig_btn}
                    {map_btn}
                </div>
                {hidden_actions_txt}
            </div>
        )
    }

    /**
     * Dig
     */
    private onDig() {

        if (cell.user_controller.usePA()) {
            dispatcher.dispatch(dispatcher.DIG)
        } else {
            console.log("not enough pa");
        }
    }

    /**
     * Show map
     */
    private showMap() {
        dispatcher.dispatch(dispatcher.SHOW_MAP)
    }

    private onSleep(sleep: boolean) {
        console.log("sleep");
        this.forceUpdate()
    }
}

export default Zone