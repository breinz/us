import * as React from "react"
import axios from "axios"
import { BuildingData } from "../../buildings/BuildingFactory";
import i18n from "../../i18n"
import { cell } from "../../main";

type PropsType = {
    id: string,
    rations: number
}

class Well extends React.Component {

    public props: PropsType;

    public state: {
        rations: number
    }

    private getWater_fct: ()=>void
    private gotWater_fct: ()=>void

    constructor(props: BuildingData) {
        super(props)
        this.getWater_fct = this.getWater.bind(this)

        this.state = {
            rations: this.props.rations
        }
        //this.setState({rations: this.props.data.rations})

        this.gotWater_fct = this.gotWater.bind(this)
    }

    componentDidMount() {
        cell.cell_socket.on("gotWater", this.gotWater_fct)
    }

    componentWillUnmount() {
        cell.cell_socket.off("gotWater", this.gotWater_fct)
    }

    public render() {
        return (
            <div>
                <div className="bignum">
                    <div className="num">{this.state.rations}</div>
                    rations
                </div>
                <button onClick={this.getWater_fct} className="button secondary hollow tiny">{i18n.__("actions.getWater")}</button>
            </div>
        )
    }

    private async getWater() {

        let res;

        try {
            res = await axios.post("/api/actions/getWater", {
                wellId: this.props.id
            })   
        } catch (error) {
            
        }

        if (res.data.error) {
            let error = res.data.error;
            switch (error) {
                case "empty":
                    console.log("No more water!");
                    break;
                case "has_already":
                    console.log("You already have water");
                    break;
            }
            return;
        }

        //this.setState({rations: this.state.rations-1})

        cell.cell_socket.emit("getWater", res.data)
    }

    /**
     * Someone took water from that well
     * @param data Data
     */
    private gotWater(data:{rations: number}) {
        this.setState({rations: data.rations})
    }
}

export default Well