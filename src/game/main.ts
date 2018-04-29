import Lvl from "./level"
import Cell from "./cell"

if (document.getElementById("user-lvl")) {
    let lvl = new Lvl();
    lvl.init();
}

if (document.getElementById("cell")) {
    let cell = new Cell();
}