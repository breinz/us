import * as Pixi from "pixi.js"
import axios from "axios"
import BuildingFactory, { BuildingData } from "../buildings/BuildingFactory";
import background from "./background"
import Dig from "../dig/Dig"
import Debug from "./Debug"
import Map from "../map/Map";
import * as React from "react"
import { render } from "react-dom"
import * as io from "socket.io-client"
import UserParams from "../params/user/UserParams"
import GameParams from "../params/game_params"
import Dev from "../dev/Dev"
import i18n from "../i18n"
import { cell } from "../main";
import dispatcher from "../dispatcher";
import { ItemModel } from "../../back/item/model";
import { UserModel, UserItemModel } from "../../back/user/model";
import User from "../user/User";
import Grid from "./Grid";
import ABuilding from "../buildings/ABuilding";

export default class Cell {

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
     * The user data
     */
    public user_data: UserModel

    /**
     * The user
     */
    public user: User;

    public user_controller: UserParams;

    /**
     * The grid for pathfinding
     */
    public grid: Grid;

    /**
     * All buildings on stage
     * @see ABuilding That pushes into that array
     */
    public arBuildings: ABuilding[]

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

            this.user_data = user.data.user

            // Connect to the cell's socket
            this.socket.emit("cell_connection", this.data._id)
            this.cell_socket = io(`http://0.0.0.0:3000/${this.data._id}`)

            this.init();
        })

        dispatcher.on(dispatcher.UPDATE_BAG, this.onUpdateBag.bind(this))
    }

    private onUpdateBag(items: any) {
        this.user_data.items = items;
    }

    /**
     * Initialize the cell
     */
    private init() {
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

        this.app.stage.interactive = true;

        // Draw the background
        background.init(this.app);

        // --------------------------------------------------
        // Buildings

        var buildings = new Pixi.Container();
        this.app.stage.addChild(buildings);

        this.data.buildings.forEach((building: BuildingData) => {
            BuildingFactory.create(building, buildings)
        });


        // --------------------------------------------------
        // User

        this.user = new User();
        this.user.init()
        buildings.addChild(this.user)
        //this.app.stage.addChild(this.user)

        // --------------------------------------------------
        // Grid

        this.grid = new Grid()
        this.app.stage.addChild(this.grid);

        // --------------------------------------------------
        // Dig

        // Prepare the dig layer
        this.app.stage.addChild(new Dig());

        // --------------------------------------------------
        // Map

        // Prepare the map layer
        this.app.stage.addChild(new Map());

        // --------------------------------------------------
        // Border

        // Draw the border around the cell
        this.drawBorder();

        // --------------------------------------------------
        // Debug

        this.app.stage.addChild(new Debug())

        // --------------------------------------------------
        // UI

        // Render ui
        this.user_controller = render(
            <UserParams user={this.user_data} />, document.getElementById("user-params")
        ) as UserParams

        render(<GameParams />, document.getElementById("game-params"))

        // --------------------------------------------------
        // DEV
        // --------------------------------------------------

        render(<Dev />, document.getElementById("dev"));
    }

    /**
     * Border around the canvas
     */
    private drawBorder = () => {
        let border = new PIXI.Graphics();
        border.lineStyle(1, 0xB6B6B6)
        border.drawRect(0.5, 0.5, this.app.view.width - 1, this.app.view.height - 1)
        this.app.stage.addChild(border)
    }

    /**
     * Dig
     */
    /*private onDig() {
        dig.start();
    }*/

}