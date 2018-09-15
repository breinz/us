import * as React from "react"
import AItemParams from "./AItemParams";
import { StateType } from "../ItemParams";
import i18n from "../../i18n";

export class BaseBallBatParams extends AItemParams {

    /**
     * @inheritDoc
     */
    protected bagButtons(state: StateType): React.ReactElement<"div"> {
        return (
            <button className="button success small" onClick={() => this.equip()}>
                {i18n.__("actions.items.equip")}
            </button>
        );
    }
}