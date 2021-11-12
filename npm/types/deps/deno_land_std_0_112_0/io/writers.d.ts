import type { Writer, WriterSync } from "./types.d.js";
/** Writer utility for buffering string chunks */
export declare class StringWriter implements Writer, WriterSync {
    private base;
    private chunks;
    private byteLength;
    private cache;
    constructor(base?: string);
    write(p: Uint8Array): Promise<number>;
    writeSync(p: Uint8Array): number;
    toString(): string;
}
