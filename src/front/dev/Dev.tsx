import * as React from "react";

export default class Dev extends React.Component {

    public render() {
        let lists: React.ReactElement<"div">[] = [];
        for (let y = 0; y < 8; y++) {
            let items: React.ReactElement<"a">[] = [];
            for (let x = 0; x < 8; x++) {
                items.push(<a><i className={`item_img active bg-x${x} bg-y${y}`}></i></a>);
            }
            lists.push(<div className="itemList">{items}</div>)
        }
        return (
            <div className="box">
                <div className="items">
                    {lists}
                </div>
            </div>
        )
    }
}