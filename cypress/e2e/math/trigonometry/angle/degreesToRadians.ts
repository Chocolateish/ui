const radConst = Math.PI / 180;

/** Converts degrees to radians*/
export let degreesToRadians = (degrees: number) => {
    return degrees * radConst;
}