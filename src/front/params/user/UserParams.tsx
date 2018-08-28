import * as React from "react"
import dispatcher from "../../dispatcher"
import { UserModel, UserItemModel } from "../../../back/user/model";
import { ItemModel } from "../../../back/item/model";
import Axios from "axios";
import { TweenLite, Quint } from "gsap";
import Item from "../../Item";
import i18n from "../../i18n";
import { cell } from "../../main";
import Mode from "../../mode";
import ABuilding from "../../buildings/ABuilding";

class UserParams extends React.Component {

    private use_pa_call: NodeJS.Timer;
    private use_pa_call_count: number = 0;

    private rest_interval: NodeJS.Timer;

    public props: {
        user: UserModel
    }

    public state: {
        bag: UserItemModel[],
        equipped: UserItemModel[],
        resting: boolean,
        pa: number,
        mode: number
    }

    constructor(props: UserModel) {
        super(props)

        console.log(this.props.user.items.bag);

        this.state = {
            bag: this.props.user.items.bag,
            equipped: this.props.user.items.equipped,
            resting: this.props.user.rest != null,
            pa: this.props.user.pa,
            mode: cell.user_data.mode
        }

        dispatcher.on(dispatcher.UPDATE_BAG, this.onUpdateBag.bind(this))
        dispatcher.on(dispatcher.UPDATE_EQUIPPED, this.onUpdateEquipped.bind(this))
        dispatcher.on(dispatcher.UPDATE_PA, this.onUpdatePa.bind(this))
        dispatcher.on(dispatcher.REST, this.onRest.bind(this))
        dispatcher.on(dispatcher.ENTER, this.onEnter.bind(this))
    }

    public componentDidMount() {
    }

    public render() {

        let items;
        let weapons;
        if (this.state.resting) {
            items = <button className="button success small" onClick={this.onWakeup.bind(this)}>{i18n.__("actions.wakeup")}</button>
        } else {
            weapons =
                <div id="equipped-list">
                    <div className="equipped-item">
                        {this.populateEquipped(0)}
                    </div>
                    <div className="equipped-item">
                        {this.populateEquipped(1)}
                    </div>
                    <div className="equipped-item">
                        {this.populateEquipped(2)}
                    </div>
                    <div className="equipped-item">
                        {this.populateEquipped(3)}
                    </div>
                    <div className="equipped-item">
                        {this.populateEquipped(4)}
                    </div>
                    <div className="equipped-item end">
                        {this.populateEquipped(5)}
                    </div>
                </div>;
            items = <div id="bag">
                <div className="item-list">
                    {this.populateItems(2)}
                </div>
                <div className="item-list">
                    {this.populateItems(1)}
                </div>
                <div className="item-list">
                    {this.populateItems(0)}
                </div>
            </div>;
        }

        const mode = this.state.mode === 1 ? "fight" : "exploration"
        const mode_class = this.state.mode === 1 ? "alert" : "secondary";


        return (
            <div className="box">
                <div>
                    <div className="grid-x">
                        <div className="cell small-6">
                            <h3>{this.props.user.login} <span id="pa">{this.state.pa}PA</span></h3>
                        </div>
                        <div className="cell small-6 text-right">
                            <div className={`label ${mode_class}`}>
                                <a href="#" onClick={this.switchMode.bind(this)}>{i18n.__(`actions.${mode}_mode`)}</a>
                            </div>
                        </div>
                    </div>
                    {weapons}
                    {items}
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
     * @return Looking for just one item, this UserItemModel, otherwise just boolean
     */
    public hasItem(item: string, count?: number): UserItemModel | boolean {
        let how_many = 0;
        for (let i = 0; i < this.state.bag.length; i++) {
            if (this.state.bag[i].item.name === item) {
                if (count === undefined) {
                    return this.state.bag[i];
                }
                how_many++;
            }
        }
        if (count !== undefined) {
            return how_many >= count
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

    /**
     * Switch mode
     */
    private switchMode() {
        let mode = this.state.mode === Mode.EXPLORATION ? Mode.FIGHT : Mode.EXPLORATION;
        this.setState({
            mode: mode
        })

        Axios.post("/api/actions/switchMode", { mode: mode });

        dispatcher.dispatch(dispatcher.SWITCH_MODE, mode)
    }

    private populateItems(weight: number): React.ReactElement<"a">[] {
        let list = null;
        if (this.state.bag) {
            list = this.state.bag.map((item, index) => {
                if (item.item.weight === weight) {
                    return (
                        <a href="#" onClick={() => { this.onClickItem(item); return false; }} key={item._id}>
                            <Item user_item={item} />
                        </a>
                    )
                }
            })
        }
        return list;
    }

    private populateEquipped(index: number): React.ReactElement<"div"> {
        console.log("populateEquipped", index, this.state.equipped);
        if (index > this.state.equipped.length - 1) {
            return null;
        }
        const item = this.state.equipped[index];
        return (
            <a href="#" onClick={() => { this.onClickItem(item); return false; }}>
                <Item user_item={item} />
            </a>
        );
    }

    /**
     * Click on an item
     */
    private onClickItem(item: UserItemModel) {
        dispatcher.dispatch(dispatcher.SELECT_ITEM, item);
    }

    private onGrabItem(item: ItemModel) {
        this.state.bag.push({ _id: Math.random(), item: item })
        this.forceUpdate()
    }

    /**
     * The content of the bag has changed
     * @param bag The bag content
     */
    private onUpdateBag(bag: UserItemModel[]) {
        this.setState({ bag: bag });
    }

    /**
     * The equipped items have changed
     * @param equipped The equipped items
     */
    private onUpdateEquipped(equipped: UserItemModel[]) {
        this.setState({ equipped: equipped })
    }

    /**
     * The pa number changed
     * @param pa Pa
     */
    private onUpdatePa(pa: number) {
        this.setState({ pa: pa });
    }

    /**
     * Enter a building
     * @param building The building
     */
    private onEnter(building: ABuilding) {
        if (building.data.building.name === "home") {
            this.onRest(5)
        }
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