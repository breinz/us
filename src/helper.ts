
/** 
 * Const to convert degres in radians
 */
export const D2R = Math.PI / 180;

/**
 * Const to convert radians in degrees
 */
export const R2D = 180 / Math.PI;

/**
 * Cosinus with degrees
 * @param a Angle in degrees
 */
export function cos(a: number) {
    return Math.cos(a * D2R);
}

/**
 * Sinus in degrees
 * @param a Angle in degrees
 */
export function sin(a: number) {
    return Math.sin(a * D2R);
}

/**
 * Shuffles an array
 * @param ar The array to shuffle
 * @return Array<Object>
 */
export function shuffle(ar: Object[]) {
    for (let i = ar.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ar[i], ar[j]] = [ar[j], ar[i]];
    }
    return ar;
}