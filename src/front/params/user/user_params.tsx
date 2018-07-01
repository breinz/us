import * as React from "react"
import dispatcher from "../../dispatcher"
import { UserModel, UserItemModel } from "../../../back/user/model";
import { ItemModel } from "../../../back/item/model";
import Axios from "axios";
import { TweenLite, Quint } from "gsap";
import Item from "../../Item";
import i18n from "../../i18n";
import { cell } from "../../main";

class UserParams extends React.Component {

    private use_pa_call: NodeJS.Timer;
    private use_pa_call_count: number = 0;

    private rest_interval: NodeJS.Timer;

    public props: {
        user: UserModel
    }

    public state: {
        items: UserItemModel[],
        resting: boolean,
        pa: number
    }

    constructor(props: UserModel) {
        super(props)

        this.state = {
            items: this.props.user.items,
            resting: this.props.user.rest != null,
            pa: this.props.user.pa
        }

        dispatcher.on(dispatcher.UPDATE_BAG, this.onUpdateBag.bind(this))
        dispatcher.on(dispatcher.REST, this.onRest.bind(this))
    }

    public componentDidMount() {
    }

    public render() {

        let content;
        if (this.state.resting) {
            content = <button className="button success small" onClick={this.onWakeup.bind(this)}>{i18n.__("actions.wakeup")}</button>
        } else {
            content = <div>
                <div className="itemList">
                    {this.populateItems(2)}
                </div>
                <div className="itemList">
                    {this.populateItems(1)}
                </div>
                <div className="itemList">
                    {this.populateItems(0)}
                </div>
            </div>;
        }


        return (
            <div className="box">
                <div>
                    <h3>{this.props.user.login} <span id="pa">{this.state.pa}PA</span></h3>
                    {content}
                </div>
                <div id="pa-bar">
                    <div id="bar" style={{ width: `${this.state.pa / 10}%` }}></div>
                </div>
            </div>
        )
    }

    /**
     * Check if the user has a specific item in its bag
     * @param item The item name to look for
     */
    public hasItem(item: String): UserItemModel {
        for (let i = 0; i < this.state.items.length; i++) {
            if (this.state.items[i].item.name === item) {
                return this.state.items[i];
            }
        }
        return null;
    }

    /**
     * Use one or more pa
     * @param count The number of pa to use (default 1)
     * @param delay [Default false] if we should wait before sending the value to the server since more updates can arise very soon
     * @return If we can afford that number of pas
     */
    public usePA(count?: number, delay?: boolean): boolean {
        if (count === undefined) count = 1

        // Not enough pas, return false
        if (this.state.pa < count) {
            return false
        }

        this.state.pa -= count;
        this.forceUpdate()

        //TweenLite.from(document.getElementById("pa"), .5, { delay: .5, color: 0xFFFFFF, backgroundColor: 0, padding: 10, marginLeft: -10, ease: Quint.easeIn })

        // Inform everyone about that change
        dispatcher.dispatch("pa", this.state.pa)

        // Every N calls we force saving, delay or not (one need to keep consistent)
        if (++this.use_pa_call_count % 20 === 0) {
            Axios.post("/api/users/updatePA", { count: this.state.pa })
            this.use_pa_call_count = 0;
        }

        clearTimeout(this.use_pa_call);

        // Save to server
        this.use_pa_call = setTimeout(() => {
            Axios.post("/api/users/updatePA", { count: this.state.pa })
            this.use_pa_call_count = 0;
        }, delay === true ? 1000 : 0);


        return true
    }

    private gainPa(count: number): boolean {
        return;
        if (this.state.pa >= 1000) {
            return false;
        }

        this.state.pa += count;
        this.forceUpdate();

        // Inform everyone about that change
        dispatcher.dispatch("pa", this.state.pa)

        Axios.post("/api/users/updatePA", { count: this.state.pa })
    }

    public get pa(): number {
        return this.state.pa;
    }

    private populateItems(weight: number): React.ReactElement<"a">[] {
        let list = this.state.items.map((item, index) => {
            if (item.item.weight === weight) {
                return (
                    <a href="#" onClick={() => { this.onClickItem(item); return false; }} key={item._id}>
                        <Item user_item={item} />
                    </a>
                )
            }
        })
        return list;
    }

    /**
     * Click on an item
     */
    private onClickItem(item: UserItemModel) {
        dispatcher.dispatch(dispatcher.SELECT_ITEM, item);
    }

    private onGrabItem(item: ItemModel) {
        this.state.items.push({ _id: Math.random(), item: item })
        this.forceUpdate()
    }

    /**
     * The content of the bag changed, retrieve the latest version
     */
    private onUpdateBag(bag: UserItemModel[]) {
        this.setState({ items: bag });
    }

    private onRest(speed: number) {
        this.setState({ resting: true })
        cell.user.visible = false;

        this.rest_interval = setInterval(() => { this.gainPa(1) }, 5000 / speed)

        Axios.post("/api/actions/rest", { pa: this.state.pa, speed: speed })

        dispatcher.dispatch(dispatcher.SLEEP, true)
    }

    private async onWakeup() {
        let res = await Axios.post("/api/actions/wakeup")

        //this.state.pa = res.data.pa;
        this.setState({
            resting: false,
            pa: res.data.pa
        })
        //this.forceUpdate();

        // Inform everyone about that change
        dispatcher.dispatch("pa", res.data.pa)

        cell.user.visible = true;

        clearInterval(this.rest_interval)

        dispatcher.dispatch(dispatcher.SLEEP, false)
    }

}

export default UserParams