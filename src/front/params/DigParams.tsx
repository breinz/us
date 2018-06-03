import * as React from "react"
import axios from "axios"
import i18n from "../i18n"
import dispatcher from "../dispatcher";
import { ItemModel } from "../../back/item/model";
import Item from "../Item";
import { cell } from "../main";

class DigParams extends React.Component {

    public state: {
        time: number,
        items: any[],
        buttons: React.ReactElement<"div">,
        tuto: React.ReactElement<"div">,
        tuto_items: React.ReactElement<"div">,
        tuto_button: React.ReactElement<"div">
    }

    private timer: number

    private tuto: boolean

    private onEndDig_fct: ()=>void
    private onDigGrab_fct: ()=>void
    private onDigFollowStart_fct: ()=>void
    private onHitWall_fct: ()=>void

    constructor(props: any) {
        super(props)

        this.tuto = cell.user.tuto;

        this.state = {
            time: 45,
            items: [],
            buttons: null,
            tuto: <div className="tuto-box" dangerouslySetInnerHTML={{__html: i18n.__("tuto.dig.eye")}}/>,
            tuto_items: null,
            tuto_button: null
        }

        this.onEndDig_fct = this.onEndDig.bind(this)
        this.onDigGrab_fct = this.onDigGrab.bind(this)
        this.onDigFollowStart_fct = this.onDigFollowStart.bind(this)
        this.onHitWall_fct = this.onHitWall.bind(this)
    }

    public componentDidMount() {
        this.timer = setInterval(this.updateTime.bind(this), 1000)

        dispatcher.on("endDig", this.onEndDig_fct)
        dispatcher.on("dig_grab", this.onDigGrab_fct)
        dispatcher.on("dig_onFollowStart", this.onDigFollowStart_fct)
        dispatcher.on("dig_onHitWall", this.onHitWall_fct)
    }

    public componentWillUnmount() {
        dispatcher.off("endDig", this.onEndDig_fct)
        dispatcher.off("dig_grab", this.onDigGrab_fct)
        dispatcher.off("dig_onFollowStart", this.onDigFollowStart_fct)
        dispatcher.off("dig_onHitWall", this.onHitWall_fct)
    }

    public render() {
        let items = this.state.items.map((item, index) => {
            return <a href="#" onClick={()=>{this.onClickItem(item);return false;}} key={index}><Item data={item}/></a>
        })

        return (
            <div>
                {this.tuto ? this.state.tuto : null}
                {this.populateTimer()}
                {this.tuto ? this.state.tuto_items : null}
                <div className="itemList">{items}</div>
                {this.tuto ? this.state.tuto_button : null}
                {this.state.buttons}
            </div>
        )
    }

    private onDigGrab(item: ItemModel): void {
        this.state.items.push(item)
        this.forceUpdate();
    }

    /**
     * Click on an item
     * @param item The item clicked
     */
    private onClickItem(item: ItemModel) {
        //let items = this.state.items;
        for (let i = this.state.items.length; i >= 0; i--) {
            if (item === this.state.items[i]) {
                this.state.items.splice(i, 1)
                break;
            }
        }
        axios.post("/api/actions/grabItem", {
            from: "dig",
            item: item
        }).then(res => {
            dispatcher.dispatch("grabItem", item)
        }).catch(err => {
            console.error("/api/actions/grabItem")
        })

        this.forceUpdate();
    }

    /**
     * Reach the end of a dig
     */
    private onEndDig(): void {
        this.setState({
            buttons: 
            <div>
                    <button className="button success small" onClick={this.keepDigging.bind(this)}>
                        {i18n.__("actions.dig.keep")}
                    </button>
            
                    <button className="button secondary small" onClick={this.quitDig.bind(this)}>
                        {i18n.__("actions.dig.stop")}
                    </button>
            
            </div>,
            tuto: null,
            tuto_items: this.populate_tutoItems(),
            tuto_button: <div className="tuto-box">{i18n.__("tuto.dig.buttons")}</div>
        })
    }

    private populate_tutoItems(): React.ReactElement<"div"> {
        if (this.state.items.length) {
            return <div className="tuto-box">{i18n.__("tuto.dig.grab")}</div>
        }
        return null;
    }

    private keepDigging() {
        dispatcher.dispatch("keepDigging")
        this.setState({
            buttons: null,
            tuto: <div className="tuto-box" dangerouslySetInnerHTML={{__html: i18n.__("tuto.dig.eye")}}/>,
            tuto_items: null,
            tuto_button: null
        })
    }

    /**
     * Quit dig
     */
    private quitDig() {
        axios.post("api/actions/dig/quit", {
            items: this.state.items
        })
        dispatcher.dispatch("quitDig")
    }

    /**
     * Start follow
     */
    private onDigFollowStart() {
        this.setState({
            tuto: <div className="tuto-box" dangerouslySetInnerHTML={{__html: i18n.__("tuto.dig.game")}}/>
        })
    }

    /**
     * Hit a wall
     */
    private onHitWall() {
        this.setState({
            tuto: <div className="tuto-box" dangerouslySetInnerHTML={{__html: i18n.__("tuto.dig.hitWall")}}/>
        })
    }

    // --------------------------------------------------
    // Timer
    // --------------------------------------------------

    private updateTime() {
        if (this.state.time === 0) {
            clearInterval(this.timer)
            return
        }
        this.setState({time: --this.state.time})
    }

    private populateTimer(): React.ReactElement<"div"> {
        if (this.tuto) {
            return(
                <div className="grid-x">
                    <div className="cell small-5" style={{paddingTop:"5px"}}>
                        <div className="bignum">
                            <div className="num">{this.formatTime()}</div>
                        </div>
                    </div>
                    <div className="cell small-7">
                        <div className="tuto-box">{i18n.__("tuto.dig.time")}</div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="bignum">
                    <div className="num">{this.formatTime()}</div>
                </div>
            )
        }
    }

    private formatTime(): string {
        const mn = Math.floor(this.state.time/60)
        const sc = this.state.time - mn*60
        return this.zero(mn) + ':' + this.zero(sc)
    }

    private zero(value: number): string {
        if (value < 10) {
            return "0" + value
        }
        return ""+value
    }
}

export default DigParams