import * as React from "react"
import i18n from "../i18n";
import dispatcher from "../dispatcher";

class Map extends React.Component {
    constructor(props: any) {
        super(props)
    }

    public render() {
        return (
            <div>
                <button onClick={this.onClose} className="button small hollow secondary">
                    {i18n.__("actions.close")}
                </button>
            </div>
        )
    }

    private onClose() {
        dispatcher.dispatch(dispatcher.HIDE_MAP)
    }
}

export default Map