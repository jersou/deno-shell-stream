import { Operator } from "../types.js";
export declare type Replacer = string | ((substring: string, ...args: any[]) => string);
export declare const replace: Operator;
