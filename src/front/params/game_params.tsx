import * as React from "react"
import dispatcher from "../dispatcher"
import { camelize, capitalize } from "underscore.string"
import i18n from "../i18n"
import Zone from "./Zone"
import { cell } from "../main"
import DigParams from "./DigParams";
import Map from "./Map";
import { ItemModel } from "../../back/item/model";
import ItemParams from "./ItemParams"
import { UserItemModel } from "../../back/user/model";
import IElement from "./IElement";
import { CellItemModel } from "../../back/cell/model";

class GameParams extends React.Component {

    public state: {
        title: string,
        component: any
    }

    constructor(props: {}) {
        super(props)

        this.state = {
            title: "Zone",
            component: <Zone />
        }
    }

    public componentDidMount() {
        dispatcher.on(dispatcher.SELECT_ELEMENT, this.onSelectElement.bind(this))
        dispatcher.on(dispatcher.SELECT_BACKGROUND, this.onSelectBackground.bind(this))
        dispatcher.on(dispatcher.DIG, this.onDig.bind(this))
        dispatcher.on(dispatcher.DIG_END, this.onQuitDig.bind(this))
        dispatcher.on(dispatcher.SHOW_MAP, this.onShowMap.bind(this))
        dispatcher.on(dispatcher.HIDE_MAP, this.onHideMap.bind(this))
        dispatcher.on(dispatcher.SELECT_ITEM,
            (item: UserItemModel | CellItemModel, origin: string) => this.onSelectItem(item, origin)
        )
    }

    public render() {
        return (
            <div className="box">
                <div>
                    <h3>{this.state.title}</h3>
                    {this.state.component}
                </div>
            </div>
        )
    }

    /**
     * Select element (building, pnj, ...)
     * @param kind The element's kind
     * @param title Title in the params box
     * @param element The component to implement
     */
    private onSelectElement(kind: string, title: string, element: IElement) {

        this.setState({
            title: capitalize(i18n.__(`${kind}s.${title}`)),
            component: element ? element.params : null
        })
    }

    /**
     * Select background
     */
    private onSelectBackground() {
        this.setState({ title: "Zone" })
        this.setState({ component: <Zone /> })
    }

    /**
     * On dig
     */
    private onDig() {
        this.setState({ title: i18n.__("actions.dig.title"), data: { action: "dig" } })
        this.setState({ component: <DigParams /> })
    }

    /**
     * Quit dig
     */
    private onQuitDig() {
        this.onSelectBackground();
    }

    /**
     * Show map
     */
    private onShowMap() {
        this.setState({
            title: i18n.__("map.title"),
            component: <Map />
        })
    }

    /**
     * Hide map
     */
    private onHideMap() {
        this.onSelectBackground()
    }

    /**
     * Select an item from user's bag
     * @param item The item selected
     * @param origin Where is the item from (bag, equipped)
     */
    private onSelectItem(item: UserItemModel | CellItemModel, origin: string): void {

        this.setState({
            title: i18n.__(`items.${item.item.name}`),
            component: <ItemParams item={item} origin={origin} key={item._id} />
        })
    }

}

export default GameParams