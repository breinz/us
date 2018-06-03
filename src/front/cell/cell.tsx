import * as Pixi from "pixi.js"
import axios from "axios"
import BuildingFactory, { BuildingData } from "../buildings/BuildingFactory";
import background from "./background"
import dig from "../dig/Dig"
import * as React from "react"
import { render } from "react-dom"
import * as io from "socket.io-client"
import UserParams from "../params/user/user_params"
import GameParams from "../params/game_params"
import i18n from "../i18n"
import { cell } from "../main";
import dispatcher from "../dispatcher";
import { ItemModel } from "../../back/item/model";
import { UserModel } from "../../back/user/model";

class Cell {

    /**
     * Pixi application
     */
    public app: Pixi.Application;

    /**
     * Main socket, reaches all users
     */
    public socket: SocketIOClient.Socket;

    /**
     * Cell's socket, reaches only the users in that cell
     */
    public cell_socket: SocketIOClient.Socket;

    /**
     * Cell's data
     */
    private data: any

    /**
     * Items available to dig
     */
    public items: ItemModel[]

    /**
     * The user
     */
    public user: UserModel

    constructor() {
        // Open the socket to the server
        this.socket = io()

        Promise.all([
            // Get the translations
            i18n.init(), 
            // Get the cell's data
            axios.get("/api/cell"),
            // get all the items
            axios.get("/api/items"),
            // get the user
            axios.get("api/users/me")
        ]
        ).then(([i, cell_data, items, user]) => {
            this.data = cell_data.data

            this.items = items.data.items

            this.user = user.data.user

            // Connect to the cell's socket
            this.socket.emit("cell_connection", this.data._id)
            this.cell_socket = io(`http://0.0.0.0:3000/${this.data._id}`)

            this.init();
        })

        dispatcher.on("onDig", this.onDig.bind(this))
    }

    /**
     * Initialize the cell
     */
    private init = () => {
        // --------------------------------------------------
        // Game
        
        // Initialize the game
        Pixi.utils.skipHello();
        this.app = new Pixi.Application({
            width: 560,
            height: 560,
            transparent: true,
            antialias: true
        })
        document.getElementById("cell").appendChild(this.app.view)

        // Draw the background
        background.init(this.app);
        
        // Draw the buildings
        var buildings = new Pixi.Container();
        this.app.stage.addChild(buildings);

        this.data.buildings.forEach((building: BuildingData) => {
            BuildingFactory.create(building, buildings)
        });

        // Prepare the dig layer
        let dig_layer: PIXI.Container = new PIXI.Container();
        this.app.stage.addChild(dig_layer)
        dig.init(dig_layer, {width: this.app.view.width, height: this.app.view.height})

        // Draw the border around the cell
        this.drawBorder();

        // --------------------------------------------------
        // UI
        
        // Render ui
        render(<UserParams user={this.user}/>, document.getElementById("user-params"))
        render(<GameParams/>, document.getElementById("game-params"))
    }

    /**
     * Border around the canvas
     */
    private drawBorder = () => {
        let border = new PIXI.Graphics();
        border.lineStyle(1, 0xB6B6B6)
        border.drawRect(0.5, 0.5, this.app.view.width-1, this.app.view.height-1)
        this.app.stage.addChild(border)
    }

    /**
     * Dig
     */
    private onDig() {
        dig.start();
    }

}

export default Cell