import * as React from "react"
import dispatcher from "../dispatcher"
import { camelize, capitalize } from "underscore.string"
import i18n from "../i18n"
import Zone from "./Zone"
import { BuildingData } from "../buildings/BuildingFactory";
import { cell } from "../main"
import DigParams from "./DigParams";
import Map from "./Map";
import ABuilding from "../buildings/ABuilding";
import { ItemModel } from "../../back/item/model";
import ItemParams from "./ItemParams"
import { UserItemModel } from "../../back/user/model";

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
        dispatcher.on(dispatcher.SELECT_BUILDING, this.onSelectBuilding.bind(this))
        dispatcher.on(dispatcher.SELECT_BACKGROUND, this.onSelectBackground.bind(this))
        dispatcher.on(dispatcher.DIG, this.onDig.bind(this))
        dispatcher.on(dispatcher.DIG_END, this.onQuitDig.bind(this))
        dispatcher.on(dispatcher.SHOW_MAP, this.onShowMap.bind(this))
        dispatcher.on(dispatcher.HIDE_MAP, this.onHideMap.bind(this))
        dispatcher.on(dispatcher.SELECT_ITEM, this.onSelectItem.bind(this))
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
     * Select building
     * @param data BuildingData
     */
    private onSelectBuilding(building: ABuilding) {

        this.setState({
            title: capitalize(i18n.__(`buildings.${building.data.building.name}`)),
            component: building.params
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
     */
    private onSelectItem(item: UserItemModel): void {

        this.setState({
            title: i18n.__(`items.${item.item.name}`),
            component: <ItemParams item={item} />
        })
    }

}

export default GameParams