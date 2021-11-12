import * as denoShim from "deno.ns";
import { EndOperator } from "../types.js";
export declare type CloseOptions = {
    processes: "KILL" | "AWAIT" | "KEEP";
};
export declare const close: EndOperator<CloseRes>;
export declare class CloseRes {
    success: boolean;
    statuses: ((denoShim.Deno.ProcessStatus & {
        cmd: string[];
    }) | undefined)[];
    out: string[];
    constructor(success: boolean, statuses: ((denoShim.Deno.ProcessStatus & {
        cmd: string[];
    }) | undefined)[], out: string[]);
    tostring(): string;
}
