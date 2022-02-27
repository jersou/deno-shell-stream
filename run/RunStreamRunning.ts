import { RunOptions, RunStream } from "./RunStream.ts";
import { assert } from "../deps.ts";

export class RunStreamRunning {
  process: Deno.Process<Deno.RunOptions>;
  processStatus?: Deno.ProcessStatus;
  stdinError?: unknown;

  constructor(
    public runStream: RunStream,
    public opt?: RunOptions,
  ) {
    if (runStream.parentRunStream) {
      const parentStdout = runStream.parentRunStream.getStdoutReadable(); // if runStream.parentRunStream → runStream.parentRunStream.opt.stdout==="piped"
      assert(
        runStream.parentRunStream.running?.opt?.stdout === "piped" ||
          runStream.parentRunStream.opt?.stdout === "piped",
        `The parent stream "${runStream.parentRunStream.cmdOrStr}" does not have the option : stdout="piped"`,
      );

      this.process = Deno.run({
        cmd: runStream.processCmd,
        ...this.runStream.opt,
        ...opt,
        stdin: "piped",
      });

      parentStdout.pipeTo(this.process.stdin!.writable).catch(
        (err) => (this.stdinError = err),
      );
    } else {
      this.process = Deno.run({
        cmd: this.runStream.processCmd,
        ...this.runStream.opt,
        ...opt,
      });
    }
  }

  async wait() {
    await this.runStream.parentRunStream?.running?.wait();
    if (!this.processStatus) {
      this.processStatus = await this.process.status();
    }

    this.process.close();

    if (
      !this.runStream.opt?.dontThrowIfStdinError &&
      this.stdinError
    ) {
      console.error(this.stdinError);
      throw new Error("Stdin error");
    }
    if (
      !this.runStream.opt?.dontThrowIfRunFail &&
      !this.processStatus?.success
    ) {
      throw new Error(`Fail, process exit code : ${this.processStatus?.code}`);
    }
    return this.processStatus;
  }

  async outputBytes() {
    const ret = await this.process.output();
    await this.wait();
    return ret;
  }

  async outputString() {
    return new TextDecoder().decode(await this.outputBytes());
  }
}
