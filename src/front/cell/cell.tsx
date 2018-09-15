import * as PIXI from "pixi.js"
import * as React from "react"
import { render } from "react-dom"
import { ItemModel } from "../../back/item/model";
import { UserModel } from "../../back/user/model";
import User from "../user/User";
import UserParams from "../params/user/UserParams";
import Grid from "./Grid";
import ABuilding from "../buildings/ABuilding";
import i18n from "../i18n";
import Axios from "axios";
import dispatcher from "../dispatcher";
import background from "./background";
import BuildingFactory from "../buildings/BuildingFactory";
import Dig from "../dig/Dig";
import Map from "../map/Map";
import Debug from "./Debug";
import GameParams from "../params/game_params";
import Dev from "../dev/Dev"
import Church1 from "../buildings/rooms/Church1";
import * as io from "socket.io-client"
import { CellBuildingModel, CellModel, CellItemModel } from "../../back/cell/model";
import Item from "./Item";

export default class Cell {

    /**
     * Pixi application
     */
    public app: PIXI.Application;

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
    private data: CellModel

    /**
     * Items available to dig
     */
    public items: ItemModel[]

    /**
     * The user data
     */
    public user_data: UserModel;

    /**
     * The user
     */
    public user: User;

    public user_controller: UserParams;

    /** The layer that owns the buildings and the user */
    public game: PIXI.Container;

    /**
     * The grid for pathfinding
     */
    public grid: Grid;

    /** 
     * Main container 
     */
    private container: PIXI.Container;

    private dev_container: PIXI.Container;

    /**
     * All buildings on stage
     * @see ABuilding That pushes into that array
     */
    public arBuildings: ABuilding[];

    constructor() {

        // Open the socket to the server
        this.socket = io()

        Promise.all([
            // Get the translations
            i18n.init(),
            // Get the cell's data
            Axios.get("/api/cell"),
            // get all the items
            Axios.get("/api/items"),
            // get the user
            Axios.get("api/users/me")
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
        dispatcher.on(dispatcher.ENTER, this.onEnter.bind(this))
    }

    private onUpdateBag(items: any) {
        this.user_data.items.bag = items;
    }

    /**
     * Initialize the cell
     */
    private init() {
        // --------------------------------------------------
        // Game

        // Initialize the game
        PIXI.utils.skipHello();
        this.app = new PIXI.Application({
            width: 560,
            height: 560,
            transparent: true,
            antialias: true
        })
        this.app.view.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        })
        document.getElementById("cell").appendChild(this.app.view)

        this.app.stage.interactive = true;

        // Draw the background
        background.init(this.app, this.data);

        // --------------------------------------------------
        // Container

        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.game = new PIXI.Container();
        this.container.addChild(this.game);

        this.dev_container = new PIXI.Container();
        this.app.stage.addChild(this.dev_container);

        // --------------------------------------------------
        // Grid

        this.grid = new Grid()
        this.dev_container.addChild(this.grid);

        // --------------------------------------------------
        // Buildings
        this.arBuildings = [];


        this.data.buildings.forEach((building: CellBuildingModel/* BuildingData*/) => {
            BuildingFactory.create(building, this.game)
        });


        // --------------------------------------------------
        // User

        this.user = new User();
        this.user.init()
        this.game.addChild(this.user)
        //this.container.addChild(this.user)


        // --------------------------------------------------
        // Items

        this.data.items.forEach((model: CellItemModel) => {
            let item: Item = new Item(model);
            item.x = model.x;
            item.y = model.y;
            this.game.addChild(item);
        })

        // --------------------------------------------------
        // Dig

        // Prepare the dig layer
        this.container.addChild(new Dig());

        // --------------------------------------------------
        // Map

        // Prepare the map layer
        this.container.addChild(new Map());

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
     * The user enters somewhere
     * @param param Where we enter
     */
    private onEnter(building: ABuilding) {
        // Enter in a building
        switch (building.data.building.name) {
            case "church":
                const room = new Church1();
                this.game.addChild(room, this.user);
                break;
        }
    }

    /**
     * Dig
     */
    /*private onDig() {
        dig.start();
    }*/

}