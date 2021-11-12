import { fromArray } from "./from_array.js";
export const fromString = (line) => fromArray(line.split("\n"));
