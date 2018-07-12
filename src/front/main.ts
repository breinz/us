import Lvl from "./level/level"
import Cell from "./cell/cell"

if (document.getElementById("user-lvl")) {
    let lvl = new Lvl();
    lvl.init();
}

export let cell: Cell;

if (document.getElementById("cell")) {
    cell = new Cell();
}