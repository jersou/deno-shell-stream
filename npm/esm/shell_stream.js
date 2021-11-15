import { log } from "./operators/log.js";
import { toFile } from "./endpoints/to_file.js";
import { run } from "./operators/run.js";
import { grep } from "./operators/grep.js";
import { timestamp } from "./operators/timestamp.js";
import { tap } from "./operators/tap.js";
import { replace } from "./operators/replace.js";
import { map } from "./operators/map.js";
import { filter } from "./operators/filter.js";
import { cut } from "./operators/cut.js";
import { close } from "./endpoints/close.js";
import { toString } from "./endpoints/to_string.js";
import { toArray } from "./endpoints/to_array.js";
import { pipe } from "./operators/pipe.js";
import { tee } from "./operators/tee.js";
import { from } from "./startpoints/from.js";
import { fromFile } from "./startpoints/from_file.js";
import { fromArray } from "./startpoints/from_array.js";
import { fromRun } from "./startpoints/from_run.js";
import { fromString } from "./startpoints/from_string.js";
import { tail } from "./operators/tail.js";
import { head } from "./operators/head.js";
import { logWithTimestamp } from "./operators/logWithTimestamp.js";
import { success } from "./endpoints/success.js";
import { sponge } from "./operators/sponge.js";
import { fromDir } from "./startpoints/from_dir.js";
import { fromWalk } from "./startpoints/from_walk.js";
import { sort } from "./operators/sort.js";
import { uniq } from "./operators/uniq.js";
import { toIterable } from "./endpoints/to_iterable.js";
export class ShellStream {
    constructor(parents, generator) {
        Object.defineProperty(this, "parents", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: parents
        });
        Object.defineProperty(this, "generator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: generator
        });
        Object.defineProperty(this, "process", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "processStatus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "processCmd", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "file", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "run", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (cmd, opt) => run(cmd, opt)(this)
        });
        Object.defineProperty(this, "toFile", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (outputPath) => toFile(outputPath)(this)
        });
        Object.defineProperty(this, "tee", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (outputPath) => tee(outputPath)(this)
        });
        Object.defineProperty(this, "log", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (transform) => log(transform)(this)
        });
        Object.defineProperty(this, "logWithTimestamp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => logWithTimestamp()(this)
        });
        Object.defineProperty(this, "grep", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (regex) => grep(regex)(this)
        });
        Object.defineProperty(this, "timestamp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => timestamp()(this)
        });
        Object.defineProperty(this, "tap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (tapFunction) => tap(tapFunction)(this)
        });
        Object.defineProperty(this, "replace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (v, r) => replace(v, r)(this)
        });
        Object.defineProperty(this, "map", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (mapFunction) => map(mapFunction)(this)
        });
        Object.defineProperty(this, "filter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (filterFunction) => filter(filterFunction)(this)
        });
        Object.defineProperty(this, "cut", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (delim, i, sep = " ") => cut(delim, i, sep)(this)
        });
        Object.defineProperty(this, "head", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (count = 1) => head(count)(this)
        });
        Object.defineProperty(this, "tail", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (count = 1) => tail(count)(this)
        });
        Object.defineProperty(this, "sponge", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => sponge()(this)
        });
        Object.defineProperty(this, "sort", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => sort()(this)
        });
        Object.defineProperty(this, "uniq", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => uniq()(this)
        });
        Object.defineProperty(this, "pipe", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (...operators) => pipe(...operators)(this)
        });
        // EndOperators
        Object.defineProperty(this, "close", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (opt = { processes: "AWAIT" }) => await close(opt)(this)
        });
        Object.defineProperty(this, "toString", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async () => await toString()(this)
        });
        Object.defineProperty(this, "toArray", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async () => await toArray()(this)
        });
        Object.defineProperty(this, "toIterable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => toIterable()(this)
        });
        Object.defineProperty(this, "success", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async () => await success()(this)
        });
    }
    static builder(generator, inputStream) {
        return new ShellStream(inputStream ? [...inputStream.parents, inputStream] : [], generator);
    }
    static empty() {
        const emptyGenerator = (async function* () { })();
        return new ShellStream([], emptyGenerator);
    }
    static subscribeProcessEvent(listener) {
        ShellStream.processEventListener.push(listener);
    }
    static unsubscribeProcessEvent(listener) {
        ShellStream.processEventListener = ShellStream.processEventListener.filter((l) => l !== listener);
    }
    static sendProcessEvent() {
        ShellStream.processEventListener.forEach((listener) => listener({
            processCount: ShellStream.processCount,
            processDone: ShellStream.processDone,
        }));
    }
    static incProcessCount() {
        ShellStream.processCount++;
        ShellStream.sendProcessEvent();
    }
    static incProcessDone() {
        ShellStream.processDone++;
        ShellStream.sendProcessEvent();
    }
}
Object.defineProperty(ShellStream, "from", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (iterable) => from(iterable)()
});
Object.defineProperty(ShellStream, "fromFile", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (path, opt) => fromFile(path, opt)()
});
Object.defineProperty(ShellStream, "fromDir", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (path) => fromDir(path)()
});
Object.defineProperty(ShellStream, "fromWalk", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (path, opt) => fromWalk(path, opt)()
});
Object.defineProperty(ShellStream, "fromArray", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (lines) => fromArray(lines)()
});
Object.defineProperty(ShellStream, "fromString", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (line) => fromString(line)()
});
Object.defineProperty(ShellStream, "fromRun", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (cmd, opt) => fromRun(cmd, opt)()
});
Object.defineProperty(ShellStream, "pipe", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (...op) => pipe(...op)(ShellStream.empty())
});
Object.defineProperty(ShellStream, "processCount", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 0
});
Object.defineProperty(ShellStream, "processDone", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 0
});
Object.defineProperty(ShellStream, "processEventListener", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: []
});
export const Pipe = ShellStream.pipe;
export const From = ShellStream.from;
export const FromFile = ShellStream.fromFile;
export const FromDir = ShellStream.fromDir;
export const FromWalk = ShellStream.fromWalk;
export const FromRun = ShellStream.fromRun;
export const FromArray = ShellStream.fromArray;
export const FromString = ShellStream.fromString;
