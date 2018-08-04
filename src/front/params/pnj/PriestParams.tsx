import * as React from "react";
import IPnj from "../../pnj/IPnj";
import i18n from "../../i18n";

export default class PriestParams extends React.Component {
    public props: {
        pnj: IPnj
    }

    public state: {
        state: string
    }

    constructor(props: any) {
        super(props)

        this.state = {
            state: "home"
        }
    }

    public render() {
        let questList_btn;
        if (this.state.state === "home") {
            questList_btn = <button className="button small" onClick={this.listQuest.bind(this)}>
                {i18n.__("actions.quest.list")}
            </button>;
        }

        return (
            <div>
                {questList_btn}
            </div>
        );
    }

    private listQuest() {
        this.setState({ state: "list" })
    }
}