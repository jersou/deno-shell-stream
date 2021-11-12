/**
 * An abstraction of multiple Uint8Arrays
 */
export declare class BytesList {
    private len;
    private chunks;
    constructor();
    /**
     * Total size of bytes
     */
    size(): number;
    /**
     * Push bytes with given offset infos
     */
    add(value: Uint8Array, start?: number, end?: number): void;
    /**
     * Drop head `n` bytes.
     */
    shift(n: number): void;
    /**
     * Find chunk index in which `pos` locates by binary-search
     * returns -1 if out of range
     */
    getChunkIndex(pos: number): number;
    /**
     * Get indexed byte from chunks
     */
    get(i: number): number;
    /**
     * Iterator of bytes from given position
     */
    iterator(start?: number): IterableIterator<number>;
    /**
     * Returns subset of bytes copied
     */
    slice(start: number, end?: number): Uint8Array;
    /**
     * Concatenate chunks into single Uint8Array copied.
     */
    concat(): Uint8Array;
}
