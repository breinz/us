import GridAdmin from "./grid/GridAdmin";
import MapAdmin from "./map/MapAdmin"

let grid: GridAdmin;

if (document.getElementById("grid-admin")) {
    grid = new GridAdmin()
    document.getElementById("load_btn").onclick = gridLoadImg;
}

if (document.getElementById("map-admin")) {
    let map = new MapAdmin();
}

function gridLoadImg() {
    const field: HTMLInputElement = document.getElementById("bg") as HTMLInputElement;
    grid.load(field.value)
}