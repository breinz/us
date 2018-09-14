import * as React from "react";

import { UserItemModel } from "../../back/user/model";
import { CellItemModel } from "../../back/cell/model";
import { IItemParams } from "./items/IItemParams";
import { FItemParams } from "./items/_Factory";

export type PropsType = {
    item: UserItemModel | CellItemModel,
    origin: string
}

export type StateType = {
    error: React.ReactElement<"div">,
    ammo?: number,
    origin: string,
    decorator: IItemParams
}

export default class ItemParams extends React.Component {

    public props: PropsType;

    public state: StateType;

    constructor(props: PropsType) {
        super(props)

        this.state = {
            error: null,
            ammo: this.props.item.ammo,
            origin: this.props.origin,
            decorator: null
        }
    }

    componentWillMount() {
        this.setState({
            decorator: FItemParams.get(this)
        });
    }

    public render() {
        return (<div>
            {this.state.error}

            {this.getInfos()}
            {this.getButtons()}
        </div>)
    }

    private getInfos(): React.ReactElement<"div"> {
        if (this.state.decorator) {
            return this.state.decorator.getInfos(this.state)
        }
    }

    private getButtons(): React.ReactElement<"div"> {
        if (this.state.decorator) {
            return this.state.decorator.getButtons(this.state)
        }
    }

}