import * as denoShim from "deno.ns";
import { LogTransformFunction } from "./operators/log.js";
import { RunOptions } from "./operators/run.js";
import { TapFunction } from "./operators/tap.js";
import { Replacer } from "./operators/replace.js";
import { MapFunction } from "./operators/map.js";
import { FilterFunction } from "./operators/filter.js";
import { Generator, OperatorFunc } from "./types.js";
import { CloseOptions } from "./endpoints/close.js";
import { FromFileOpt } from "./startpoints/from_file.js";
import { WalkOptions } from "./deps.js";
export declare class ShellStream {
    parents: ShellStream[];
    generator: Generator;
    process?: denoShim.Deno.Process;
    processStatus?: denoShim.Deno.ProcessStatus;
    processCmd?: string[];
    file?: denoShim.Deno.File;
    private constructor();
    run: (cmd: string[] | string, opt?: RunOptions | undefined) => ShellStream;
    toFile: (outputPath: string) => Promise<import("./endpoints/close.js").CloseRes>;
    tee: (outputPath: string) => ShellStream;
    log: (transform?: LogTransformFunction | undefined) => ShellStream;
    logWithTimestamp: () => ShellStream;
    grep: (regex: RegExp) => ShellStream;
    timestamp: () => ShellStream;
    tap: (tapFunction: TapFunction) => ShellStream;
    replace: (v: string | RegExp, r: Replacer) => ShellStream;
    map: (mapFunction: MapFunction) => ShellStream;
    filter: (filterFunction: FilterFunction) => ShellStream;
    cut: (delim: string, i: number[], sep?: string) => ShellStream;
    head: (count?: number) => ShellStream;
    tail: (count?: number) => ShellStream;
    sponge: () => ShellStream;
    sort: () => ShellStream;
    uniq: () => ShellStream;
    pipe: (...operators: OperatorFunc[]) => ShellStream;
    close: (opt?: CloseOptions) => Promise<import("./endpoints/close.js").CloseRes>;
    toString: () => Promise<string>;
    toArray: () => Promise<string[]>;
    toIterable: () => AsyncIterable<string>;
    success: () => Promise<boolean>;
    static builder(generator: Generator, inputStream?: ShellStream): ShellStream;
    static empty(): ShellStream;
    static from: (iterable: AsyncIterable<string> | Iterable<string>) => ShellStream;
    static fromFile: (path: string, opt?: FromFileOpt | undefined) => ShellStream;
    static fromDir: (path: string) => ShellStream;
    static fromWalk: (path: string, opt?: WalkOptions | undefined) => ShellStream;
    static fromArray: (lines: string[]) => ShellStream;
    static fromString: (line: string) => ShellStream;
    static fromRun: (cmd: string[] | string, opt?: RunOptions | undefined) => ShellStream;
    static pipe: (...op: OperatorFunc[]) => ShellStream;
    static processCount: number;
    static processDone: number;
    static processEventListener: ProcessEventListener[];
    static subscribeProcessEvent(listener: ProcessEventListener): void;
    static unsubscribeProcessEvent(listener: ProcessEventListener): void;
    static sendProcessEvent(): void;
    static incProcessCount(): void;
    static incProcessDone(): void;
}
export declare type ProcessEvent = {
    processCount: number;
    processDone: number;
};
export declare type ProcessEventListener = (event: ProcessEvent) => unknown;
export declare const Pipe: (...op: OperatorFunc[]) => ShellStream;
export declare const From: (iterable: AsyncIterable<string> | Iterable<string>) => ShellStream;
export declare const FromFile: (path: string, opt?: FromFileOpt | undefined) => ShellStream;
export declare const FromDir: (path: string) => ShellStream;
export declare const FromWalk: (path: string, opt?: WalkOptions | undefined) => ShellStream;
export declare const FromRun: (cmd: string[] | string, opt?: RunOptions | undefined) => ShellStream;
export declare const FromArray: (lines: string[]) => ShellStream;
export declare const FromString: (line: string) => ShellStream;
