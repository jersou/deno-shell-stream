import * as denoShim from "deno.ns";
export const osType = (() => {
    // deno-lint-ignore no-explicit-any
    const { Deno } = ({ ...denoShim, ...globalThis });
    if (typeof Deno?.build?.os === "string") {
        return Deno.build.os;
    }
    // deno-lint-ignore no-explicit-any
    const { navigator } = ({ ...denoShim, ...globalThis });
    if (navigator?.appVersion?.includes?.("Win") ?? false) {
        return "windows";
    }
    return "linux";
})();
export const isWindows = osType === "windows";
