import * as React from "react"
import i18n from "../../i18n"
import dispatcher from "../../dispatcher";

class Zone extends React.Component {

    public render() {
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
                <button onClick={this.onDig} className="button success small">{i18n.__("actions.dig.start")}</button>
            </div>
        )
    }

    private onDig() {
        dispatcher.dispatch("onDig")
    }
}

export default Zone