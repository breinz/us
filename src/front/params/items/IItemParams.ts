import { StateType } from "../ItemParams";

export interface IItemParams {
    /**
     * Get the item infos
     * @param state The component state
     */
    getInfos(state: StateType): React.ReactElement<"div">;

    /**
     * Get the item's action buttons
     * @param state The component's state
     */
    getButtons(state: StateType): React.ReactElement<"div">;
}