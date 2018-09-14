import * as React from "react"
import AItemParams from "./AItemParams";
import { StateType } from "../ItemParams";
import i18n from "../../i18n";
import { cell } from "../../main";
import Item from "../../Item";
import post from "../../api";
import { Us } from "../../../us";
import dispatcher from "../../dispatcher";

export class StringParams extends AItemParams {

    /**
     * @inheritDoc
     */
    public getButtons(state: StateType): React.ReactElement<"div"> {
        this.hidden_actions = 0;
        let assemble;
        if (cell.user_controller.hasItem("string", 5)) {
            assemble =
                <button
                    className="button success small"
                    onClick={() => this.assemble()}>

                    <Item item={{ x: 1, y: 0 }} active={false} still={true} />
                    {i18n.__("actions.items.assemble")}
                </button>
        } else {
            this.hidden_actions++;
        }

        return (
            <div>
                <div>
                    {assemble}
                </div>
                {this.getHiddenActions()}
            </div>
        )
    }

    /**
     * Assemble to get a rope
     */
    private async assemble() {
        let data: Us.String.ApiResult.assemble = await post("/api/actions/items/string/assemble");
        //let res = await Axios.post("/api/actions/items/string/assemble")

        if (this.handleError(data)) {
            return;
        }

        dispatcher.dispatch(dispatcher.UPDATE_BAG, data.bag)

        // Select empty bottle
        dispatcher.dispatch(dispatcher.SELECT_ITEM,
            cell.user_data.items.bag.find(item => { return item.item.name === "rope" })
        )
    }
}