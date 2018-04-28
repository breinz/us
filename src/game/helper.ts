
/** 
 * Const to convert degres in radians
 */
export const D2R = Math.PI/180;

/**
 * Cosinus with degrees
 * @param a Ange in degrees
 */
export function cos(a:number) {
    return Math.cos(a*D2R);
}

/**
 * Sinus in degrees
 * @param a Angle in degrees
 */
export function sin(a:number) {
    return Math.sin(a*D2R);
}