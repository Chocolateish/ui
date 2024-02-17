const degConst = 180 / Math.PI;

/** Converts radians todegrees*/
export let radiansTodegrees = (radians: number) => {
    return radians * degConst;
}
