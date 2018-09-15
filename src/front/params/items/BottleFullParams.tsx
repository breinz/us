import * as React from "react"
import AItemParams from "./AItemParams";
import { StateType } from "../ItemParams";
import i18n from "../../i18n";
import post from "../../api";
import dispatcher from "../../dispatcher";
import { Us } from "../../../us";
import { cell } from "../../main";

export class BottleFullParams extends AItemParams {

    /**
     * @inheritDoc
     */
    protected bagButtons(state: StateType): React.ReactElement<"div"> {
        return (
            <button
                className="button success small"
                onClick={() => this.drink()}
                dangerouslySetInnerHTML={{ __html: i18n.__("actions.items.drink") }
                }></button>
        )
    }

    /**
     * Drink the bottle
     */
    private async drink() {
        this.clearError();

        let data: Us.Bottle.ApiResult.drink = await post("/api/actions/drink", { item: this.component.props.item });
        //let res = await Axios.post("/api/actions/drink", { item: this.props.item })

        if (this.handleError(data)) {
            return;
        }

        // Update user infos
        dispatcher.dispatch(dispatcher.UPDATE_BAG, data.bag)
        dispatcher.dispatch(dispatcher.UPDATE_PA, data.pa)

        // Select empty bottle
        dispatcher.dispatch(dispatcher.ITEM_SELECTED,
            cell.user_data.items.bag.find(item => { return item.item.name === "bottle" })
        )
    }
}