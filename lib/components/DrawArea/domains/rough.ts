import RoughType from "roughjs/bin/rough";
// @ts-ignore
import roughESM from "roughjs/bundled/rough.cjs.js";

export const rough: typeof RoughType = roughESM;
export type IRoughSVG = ReturnType<typeof rough.svg>;
