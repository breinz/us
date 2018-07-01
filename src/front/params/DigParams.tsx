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
        keepDigging_btn: React.ReactElement<"button">,
        tuto: React.ReactElement<"div">,
        tuto_items: React.ReactElement<"div">,
        tuto_button: React.ReactElement<"div">
    }

    private timer: number

    private tuto: boolean

    private onEndLevel_fct: () => void
    private onDigRevealItem_fct: () => void
    private onDigFollowStart_fct: () => void
    private onHitWall_fct: () => void

    constructor(props: any) {
        super(props)

        this.tuto = cell.user_data.tuto;

        this.state = {
            time: 45,
            items: [],
            keepDigging_btn: null,
            tuto: <div className="tuto-box" dangerouslySetInnerHTML={{ __html: i18n.__("tuto.dig.eye") }} />,
            tuto_items: null,
            tuto_button: null
        }

        this.onEndLevel_fct = this.onEndLevel.bind(this)
        this.onDigRevealItem_fct = this.onDigRevealItem.bind(this)
        this.onDigFollowStart_fct = this.onDigFollowStart.bind(this)
        this.onHitWall_fct = this.onHitWall.bind(this)
    }

    public componentDidMount() {
        this.timer = setInterval(this.updateTime.bind(this), 1000)

        dispatcher.on(dispatcher.DIG_END_LEVEL, this.onEndLevel_fct)
        dispatcher.on(dispatcher.DIG_UNDIG_ITEM, this.onDigRevealItem_fct)
        dispatcher.on(dispatcher.DIG_FOLLOW, this.onDigFollowStart_fct)
        dispatcher.on(dispatcher.DIG_HIT_WALL, this.onHitWall_fct)
    }

    public componentWillUnmount() {
        clearInterval(this.timer);

        dispatcher.off(dispatcher.DIG_END_LEVEL, this.onEndLevel_fct)
        dispatcher.off(dispatcher.DIG_UNDIG_ITEM, this.onDigRevealItem_fct)
        dispatcher.off(dispatcher.DIG_FOLLOW, this.onDigFollowStart_fct)
        dispatcher.off(dispatcher.DIG_HIT_WALL, this.onHitWall_fct)
    }

    public render() {
        let items = this.state.items.map((item, index) => {
            return <a href="#" onClick={() => { this.onClickItem(item); return false; }} key={index}><Item item={item} /></a>
        })

        return (
            <div>
                {this.tuto ? this.state.tuto : null}
                {this.populateTimer()}
                {this.tuto ? this.state.tuto_items : null}
                <div className="itemList">{items}</div>
                {this.tuto ? this.state.tuto_button : null}
                <div>
                    {this.state.keepDigging_btn}
                    <button className="button secondary hollow small" onClick={this.quitDig.bind(this)}>
                        {i18n.__("actions.dig.stop")}
                    </button>
                </div>
            </div>
        )
    }

    private onDigRevealItem(item: ItemModel): void {
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
            dispatcher.dispatch(dispatcher.UPDATE_BAG, res.data.bag)
        }).catch(err => {
            console.error("/api/actions/grabItem")
        })

        this.forceUpdate();
    }

    /**
     * Reach the end of a dig
     */
    private onEndLevel(): void {
        this.setState({
            keepDigging_btn: <button className="button success small" onClick={this.keepDigging.bind(this)} dangerouslySetInnerHTML={{ __html: i18n.__("actions.dig.keep") }}>
            </button>,
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
        dispatcher.dispatch(dispatcher.DIG_NEXT_LEVEL)
        this.setState({
            keepDigging_btn: null,
            tuto: <div className="tuto-box" dangerouslySetInnerHTML={{ __html: i18n.__("tuto.dig.eye") }} />,
            tuto_items: null,
            tuto_button: null
        })
    }

    /**
     * Quit dig
     */
    private quitDig() {
        axios.post("api/actions/dig/quit")
        dispatcher.dispatch(dispatcher.DIG_END)
    }

    /**
     * Start follow
     */
    private onDigFollowStart() {
        this.setState({
            tuto: <div className="tuto-box" dangerouslySetInnerHTML={{ __html: i18n.__("tuto.dig.game") }} />
        })
    }

    /**
     * Hit a wall
     */
    private onHitWall() {
        this.setState({
            tuto: <div className="tuto-box" dangerouslySetInnerHTML={{ __html: i18n.__("tuto.dig.hitWall") }} />
        })
    }

    // --------------------------------------------------
    // Timer
    // --------------------------------------------------

    private updateTime() {
        if (this.state.time === 0) {
            this.quitDig();
            /*if (cell.user_controller.usePA()) {
                this.state.time = 46
            } else {
                console.log("quit")
                clearInterval(this.timer)
            }*/
            return
        }
        this.setState({ time: --this.state.time })
    }

    private populateTimer(): React.ReactElement<"div"> {
        if (this.tuto) {
            return (
                <div className="grid-x">
                    <div className="cell small-5" style={{ paddingTop: "5px" }}>
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
        const mn = Math.floor(this.state.time / 60)
        const sc = this.state.time - mn * 60
        return this.zero(mn) + ':' + this.zero(sc)
    }

    private zero(value: number): string {
        if (value < 10) {
            return "0" + value
        }
        return "" + value
    }
}

export default DigParams