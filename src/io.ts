import { Server, Socket } from "socket.io";
import { Http2Server } from "http2";

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
            //console.log(`client connected to cell ${cellId}`);

            cellSocket.on("getWater", (params) => {
                io.of(`/${cellId}`).emit("gotWater", params)
            })

            cellSocket.on("addWater", (params) => {
                io.of(`/${cellId}`).emit("addedWater", params)
            })

            cellSocket.on("well.poison", (params) => {
                io.of(`/${cellId}`).emit("well.poisoned", params)
            })
        })

        this.cells.push(cellId)
    }
}
export default new Io()