import * as React from "react"
import axios from "axios"
import { BuildingData } from "../../buildings/BuildingFactory";
import i18n from "../../i18n"

type PropsType = {
    data: {
        _id?: any,
        building?: {
            name: string
        }
    }
}

class House extends React.Component {

    public props: PropsType;

    private enter_fct: ()=>void

    constructor(props: BuildingData) {
        super(props)
        this.enter_fct = this.enter.bind(this)
    }


    public render() {
        return (
            <div>
                <button onClick={this.enter_fct} className="button secondary hollow tiny">{i18n.__("actions.enter")}</button>
            </div>
        )
    }

    private async enter() {

        let res;

        try {
            res = await axios.post("/api/actions/getWater", {
                wellId: this.props.data._id
            })   
        } catch (error) {
            
        }

        console.log(res);

        if (res.data.error) {
            let error = res.data.error;
            switch (error) {
                case "empty":
                    console.log("No more water!");
                    break;
                case "has_already":
                    console.log("You already have water");
                    break;
                default:
                    break;
            }
        }
    }
}

export default House