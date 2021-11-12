import { StartOperator } from "../types.js";
import { fromArray } from "./from_array.js";

export const fromString: StartOperator = (line: string) =>
  fromArray(line.split("\n"));
