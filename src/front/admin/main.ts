import GridAdmin from "./grid/GridAdmin";

let grid: GridAdmin;

if (document.getElementById("grid-admin")) {
    grid = new GridAdmin()
    document.getElementById("load_btn").onclick = gridLoadImg;
}

function gridLoadImg() {
    const field: HTMLInputElement = document.getElementById("bg") as HTMLInputElement;
    grid.load(field.value)
}