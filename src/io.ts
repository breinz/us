import { Server, Socket } from "socket.io";
import { Http2Server } from "http2";
import message from "./SocketMessages"
import { Us } from "./us";

class Io {

    private io: Server;

    /**
     * Main socket to /
     */
    private socket: Socket;

    /**
     * List of cellIds
     */
    private cells: string[];

    public init(server: Http2Server) {
        this.cells = [];

        this.io = require("socket.io")(server)

        this.io.on("connection", (socket: Socket) => {
            this.socket = socket;
            //console.log("client connected");

            socket.on("cell_connection", (cellId: string) => {
                this.onCellConnection(cellId);
            })

            socket.on("disconnect", (reason) => {
                //console.log("client disconnect", reason);
            })
        })
    }

    private onCellConnection(cellId: string) {
        // Check if that cell is already listening for connections
        for (let index = 0; index < this.cells.length; index++) {
            if (this.cells[index] === cellId) {
                return;
            }
        }

        const io = this.io;

        // --------------------------------------------------
        // Allow connections to that cell
        // --------------------------------------------------

        this.io.of(`/${cellId}`).on("connection", (cellSocket: Socket) => {

            const socket = io.of(`/${cellId}`);

            cellSocket.on(message.Well.GET_WATER, (params) => {
                socket.emit(message.Well.GOT_WATER, params)
            })

            cellSocket.on(message.Well.ADD_WATER, (params) => {
                socket.emit(message.Well.ADDED_WATER, params)
            })

            cellSocket.on(message.Well.POISON, (params: Us.Safe.ApiResult.Poison) => {
                socket.emit(message.Well.POISONED, params)
            })

            cellSocket.on(message.Safe.OPEN, (params: Us.Safe.ApiResult.Open) => {
                socket.emit(message.Safe.OPENED, params)
            })

            cellSocket.on(message.Safe.REFILL, (params) => {
                socket.emit(message.Safe.REFILLED, params)
            })

            cellSocket.on(message.Item.GRAB, (params) => {
                socket.emit(message.Item.GRABBED, params)
            })
        })

        this.cells.push(cellId)
    }
}
export default new Io()