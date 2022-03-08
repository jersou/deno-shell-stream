import { readAll, TextLineStream } from "../deps.ts";
import { LineStream } from "../line/LineStream.ts";
import { Stream } from "../Stream.ts";

export class FileStream extends LineStream<string> {
  fsFile: Deno.FsFile;
  byteReadableStream?: ReadableStream;

  constructor(public file: Deno.FsFile | string, parent?: LineStream<unknown>) {
    super(parent);
    this.fsFile = (typeof file === "string") ? Deno.openSync(file) : file;
  }

  getLineReadableStream(): ReadableStream<string> {
    if (!this.linesStream) {
      this.linesStream = this
        .toByteReadableStream()
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new TextLineStream());
    }
    return this.linesStream!;
  }

  wait(): Promise<this> {
    return Promise.resolve(this);
  }

  async toBytes() {
    if (Stream.verbose) {
      console.log("ReadAll file", this.file);
    }
    const bytes = await readAll(this.fsFile);
    Deno.close(this.fsFile.rid);
    return bytes;
  }

  async toString() {
    return new TextDecoder().decode(await this.toBytes());
  }

  toByteReadableStream() {
    if (Stream.verbose) {
      console.log("Open readable of file", this.file);
    }
    return this.fsFile.readable;
  }

  async toFile(file: Deno.FsFile | string) {
    const fsFile = (typeof file === "string") ? await Deno.create(file) : file;
    await this.fsFile.readable.pipeTo(fsFile.writable);
    return this.wait();
  }
}
