import * as React from "react"
import dispatcher from "../dispatcher"
import {capitalize} from "underscore.string"
import i18n from "../i18n"
import Zone from "./buildings/Zone"
import Well from "./buildings/Well"
import House from "./buildings/House"
import { BuildingData } from "../buildings/BuildingFactory";
import { cell } from "../main"
import DigParams from "./DigParams";

type StateType = {
    title: string,
    component: any
}

class GameParams extends React.Component {

    state: StateType = {
        title: "Zone",
        component: <Zone/>
    }

    componentDidMount() {
        this.state.title = "Zone"
        dispatcher.on("selectBuilding", this.onSelectBuilding.bind(this))
        dispatcher.on("selectBackground", this.onSelectBackground.bind(this))
        dispatcher.on("onDig", this.onDig.bind(this))
    }

    /**
     * Select building
     * @param data BuildingData
     */
    private onSelectBuilding(data: BuildingData) {
        this.setState({title: capitalize(i18n.__(`buildings.${data.building.name}`))})
        switch (data.building.name) {
            case "home":
                this.setState({component: <House data={data}/>})
                break;
            case "well":
                this.setState({component: <Well rations={data.rations} id={data._id}/>})
                break;
        }
    }

    /**
     * Select background
     */
    private onSelectBackground() {
        this.setState({title: "Zone"})
        this.setState({component: <Zone/>})
    }

    /**
     * On dig
     */
    private onDig() {
        this.setState({title: i18n.__("actions.dig.title"), data: {action:"dig"}})
        this.setState({component: <DigParams/>})
    }

    public render() {
        return(
            <div className="box">
                <div>
                    <h3>{this.state.title}</h3>
                    {this.state.component}
                </div>
            </div>
        )
    }
    
}

export default GameParams