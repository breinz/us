import Lvl from "./level"

/**
 * Converts degres in radians
 * @param deg Angle in degres
 */
function deg2rad(deg:number) {
    return deg * Math.PI / 180;
}

if (document.getElementById("user-lvl")) {
    let lvl = new Lvl();
    lvl.init();
}