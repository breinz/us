import config from './back/config'
import app from './back/app'
import socket from "./io"

let server = require("http").createServer(app);

socket.init(server)



/*io.of('/pom').on("connection", () => {
    console.log("client connected to 'pom'");
})*/

server.listen(config.port, () => {
    console.log(`Listening on ${config.port}`)
})