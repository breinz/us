import * as React from "react"
import dispatcher from "../../dispatcher"
import { UserModel } from "../../../back/user/model";
import { ItemModel } from "../../../back/item/model";
import Item from "../../Item";

class UserParams extends React.Component {

    public props: {
        user: UserModel
    }

    public state:{
        items: {_id?: any, item: ItemModel}[]
    }

    constructor(props: UserModel) {
        super(props)

        this.state = {
            items: this.props.user.items
        }

        dispatcher.on("grabItem", this.onGrabItem.bind(this))
    }

    public componentDidMount() {
    }

    render() {
        return(
            <div className="box">
                <div>
                    <h3>{this.props.user.login}</h3>
                    <div className="itemList">
                        {this.populateItems(2)}
                    </div>
                    <div className="itemList">
                        {this.populateItems(1)}
                    </div>
                    <div className="itemList">
                        {this.populateItems(0)}
                    </div>
                </div>
            </div>
        )
    }

    private populateItems(weight: number): React.ReactElement<"a">[] {
        let list = this.state.items.map((item, index) => {
            if (item.item.weight === weight) {
                return(
                    <a href="#" onClick={()=>{this.onClickItem(item.item);return false;}} key={item._id}>
                        <Item data={item.item}/>
                    </a>
                )
            }
        })
        return list;
    }

    private onClickItem(item: ItemModel) {

    }

    private onGrabItem(item: ItemModel) {
        this.state.items.push({_id: Math.random(), item: item})
        this.forceUpdate()
    }
    
}

export default UserParams