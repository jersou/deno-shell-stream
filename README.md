# Deno ShellStream

ShellStream is a lib for Deno that mix I/O
[stream API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) and
Shell pipe/redirects.

It has zero 3rd party dependencies and don't internally run sh or bash commands.

→ Deno Doc : https://doc.deno.land/https://deno.land/x/shell_stream/mod.ts

**Note : you might be more interested in this project :
https://github.com/dsherret/dax**

## Quick examples

```typescript
import {
  run,
  runToString,
  Stream,
} from "https://deno.land/x/shell_stream/mod.ts";
import { bgBlue } from "https://deno.land/std@0.158.0/fmt/colors.ts";

console.log(await runToString("uname --kernel-name")); // → Linux

let rootLine = await Stream
  .fromRun("cat /etc/passwd")
  .run("grep /root")
  .toString();
console.log(rootLine); // → root:x:0:0:root:/root:/bin/bash

// the same example without run cat & grep command :
rootLine = await Stream.fromFile("/etc/passwd")
  .log(bgBlue) // → log the entire file with blue background
  .grep(/\/root/) // keep lines that contain /root
  .log() // → log "root:x:0:0:root:/root:/bin/bash"
  .toString();
console.log({ rootLine });
// → { rootLine: "root:x:0:0:root:/root:/bin/bash" }

const denoVersionFromCli = await Stream
  .fromRun(["deno", "--version"])
  .head(1)
  .toString();
console.log({ denoVersionFromCli });
// → { denoVersionFromCli: "deno 1.19.2 (release, x86_64-unknown-linux-gnu)" }

console.log(await run("deno --version").tail(2).toArray());
// → [ "v8 9.9.115.7", "typescript 4.5.2" ]
```

See more examples in `examples/` directory.

### Startpoint Operators

- `Stream.fromRun(cmd: string[] | string, opt?:` [RunOptions](#RunOptions) `)`:
  generate stream from the process. If cmd is a string, it will be parsed to
  array.
- `Stream.fromFile(file: Deno.FsFile | string)`: generate a stream from the
  file.
- `Stream.fromDir(path: string)`: generate a stream of `Deno.DirEntry` from dir.
- `Stream.fromFetch(url: string)`: generate a stream from a http query.
- `Stream.fromArray<T>(array: T[])`: generate a stream from each element of the
  array.
- `Stream.fromString(str: string)`: generate a stream from string
- `Stream.fromWalk(path: string, opt?: WalkOptions)`: generate a stream of file
  path from dir, using [walk](https://deno.land/std/fs#walk), see
  [WalkOptions](https://doc.deno.land/https/deno.land/std@0.158.0/fs/walk.ts#WalkOptions).

### Intermediate Operators

- `cut(delim: string, indexes: number[])` : transform the stream with the part
  ordered by indexes, split the line by `delim`.
- `filter(filterFunction: FilterFunction<T>)` : transform the stream, keep only
  lines that return true with the filterFunction.
- `grep(regex: RegExp | string, opt?: { onlyMatching?: boolean })` : transform
  the stream, keep only lines that match the regex. If
  `opt.onlyMatching === true`, the stream is then all results matching the
  complete regex, like `grep -o` Linux command.
- `grepo(regex: RegExp | string)` : alias of grep() with opt :
  `{ onlyMatching: true }`.
- `head(max = 1)` : transform the stream, keep only first `count` lines.
- `log(transform?: LogTransformFunction<T>)` : keep stream unchanged, log each
  lines in the console. Use the transform function if defined before log.
- `logJson(replacer = null, space = "  ")` : keep stream unchanged, log each
  lines as json in the console.
- `logWithTimestamp(transform?: LogTransformFunction<string>)` : keep stream
  unchanged, log each lines in the console with the date (ISOString) at the
  beginning. Use the transform function if defined before log.
- `map(mapFunction: MapFunction<T, U>)` : transform the stream with the return
  of mapFunction
- `replace(searchValue: string | RegExp, replacer: string)` : transform the
  stream with the "replace" result.
- `replaceAll(searchValue: string | RegExp, replacer: string)` : transform the
  stream with the replaceAll result.
- `run(cmdOrStr: string[] | string, opt: RunOptions = {})` : generate a stream
  with the current stream as the stdin of the new process. If cmd is a string,
  it will be parsed to array.
- `sort(compareFn?: CompareFn)` : transform the stream, sort the stream.
- `sponge()` : keep stream unchanged, soaks up all its input before re-emit all.
- `tail(max = 1)` : transform the stream, keep only last `count` lines.
- `tap(tapFunction: TapFunction<T>)` : keep stream unchanged, run the
  `tapFunction` for each line.
- `tee(path: string)` : keep stream unchanged, write the stream in the
  `outputPath` file.
- `transform(transformStream: TransformStream<T, U>)` : transform the stream
  with the transformStream.
- `uniq()` : transform the stream, keep only lines that are different from
  previous line.
- `mapAwait(mapFunction: MapFunction<T, Promise<U>>)` : apply the transform
  function to have a promise, emit the promise result
- `mapAwaitParallel(mapFunction: MapFunction<T, Promise<U>>, max?: number)`
  :Consume a stream of element, apply a function on it to have promises, pause
  the consumption if there are "max" pending promise
- `xargsN1(cmdOrStr: string[] | string, opt?: RunOptions)` :Like `xargs -n 1`,
  run a process with input element as last argument of cmd. Alias for
  `mapAwait((e) => waitRun([...cmd, String(e)], opt))`.
- `xargsN1P(cmdOrStr: string[] | string, max?: number, opt?: RunOptions)` : Like
  `xargs -n 1 -P max`, run a process with input element as last argument of cmd.
  Alias for `mapAwaitParallel((e) => waitRun([...cmd, String(e)], opt), max)`

### Endpoint Operators

- `wait(): Promise<Stream>` : the stream is closed and returned.
- `toArray(): Promise<T[]>` : the stream is closed and converted to Array.
- `toBytes(): Promise<Uint8Array>` : the stream is closed and converted to
  Uint8Array.
- `toByteReadableStream(): ReadableStream<Uint8Array>` : return the stream as
  bytes ReadableStream.
- `toFile(file: Deno.FsFile | string): Promise<Stream>` : the stream is closed
  and write to the `outputPath` file.
- `toIterable(): AsyncIterable<T>` : return the iterable of the stream. The
  stream is closed at end of the iterable.
- `toString(): Promise<string>` : the stream is closed and converted to String.
- `getLineReadableStream(): ReadableStream<T>` : return the Stream of elements,
  split the output by line if the stream is from Run/File.
- `success(): Promise<boolean>` : the stream is closed and the success state is
  returned (all parents RunStream are checked).
- `fail(): Promise<boolean>` : the stream is closed and the fail state is
  returned (all parents RunStream are checked).

### CWD

`setCwd` or `Stream.setCwd` : change the cwd option for future run.

### verbose

`Stream.setverbose` : enable verbose mode

### Aliases

- runOk(cmdOrStr, opt) = Stream.fromRun(cmdOrStr, opt).success()
- runKo(cmdOrStr, opt) = Stream.fromRun(cmdOrStr, opt).fail()
- runToString(cmdOrStr, opt) = Stream.fromRun(cmdOrStr, opt).toString()
- waitRun(cmdOrStr, opt) = Stream.fromRun(cmdOrStr, opt).wait()
- run = Stream.fromRun
- read = Stream.fromFile

### RunOptions

Extends [Deno.RunOptions](https://doc.deno.land/builtin/stable#Deno.RunOptions)

```
export type RunOptions = Omit<Deno.RunOptions, "cmd"> & {
  allowFail?: boolean;
  exitCodeOnFail?: number;
  useStderr?: boolean;
};
```

- allowFail: throw an error if the process exit code !== 0.
- exitCodeOnFail: if the process exit code !== 0, immediately exit from Deno
  with this exit code
- useStderr: use stderr instead of stdout

## Development

### vendor/

The folder `vendor` is **not** necessary for the project to work, it just allows
to save its dependencies.

### deno task

Some dev command are listed in the deno.json file, this file can be use with
[deno task](https://deno.land/manual@v1.20.1/tools/task_runner) :

- test: launch tests
- test-watch: launch tests on file change
- lint: lint the code
- fmt: format the code
- vendor: backup the dependencies to `vendor/`
- gen-cov: generate the test coverage
- pre-commit
- pre-commit-skip-git-check
- ci
