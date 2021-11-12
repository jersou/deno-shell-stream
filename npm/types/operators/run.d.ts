import * as denoShim from "deno.ns";
import { Operator } from "../types.js";
export declare type RunOptions = Omit<denoShim.Deno.RunOptions, "cmd"> & {
    throwIfRunFail?: boolean;
    exitCodeIfRunFail?: number;
    streamStdErr?: boolean;
};
export declare const run: Operator;
export declare function parseCmdString(cmdOrStr: string[] | string): string[];
export declare function closeProcess(process: denoShim.Deno.Process): void;
