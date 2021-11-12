(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "deno.ns", "./deps.js"], factory);
    }
})(function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sanitize = exports.checkOps = exports.checkResources = void 0;
    const tslib_1 = require("tslib");
    const denoShim = (0, tslib_1.__importStar)(require("deno.ns"));
    const deps_js_1 = require("./deps.js");
    const stdRes = ["stdin", "stderr", "stdout"];
    function checkResources() {
        let noOpenedRessource = true;
        const res = denoShim.Deno.resources();
        if (Object.keys(res).length !== 3 &&
            Object.values(res).filter((v) => !stdRes.includes(v)).length > 0) {
            console.log((0, deps_js_1.bgRed)("Some resources are not closed except stdin/stderr/stdout :"));
            console.log(res);
            noOpenedRessource = false;
        }
        return noOpenedRessource;
    }
    exports.checkResources = checkResources;
    function checkOps() {
        let noOpsInProgress = true;
        const metrics = denoShim.Deno.metrics();
        const opsMetricsNameGroups = [
            ["opsDispatched", "opsCompleted"],
            ["opsDispatched", "opsCompleted"],
            ["opsDispatchedSync", "opsCompletedSync"],
            ["opsDispatchedAsync", "opsCompletedAsync"],
            ["opsDispatchedAsyncUnref", "opsCompletedAsyncUnref"],
        ];
        opsMetricsNameGroups.forEach((group) => {
            const dispatched = group[0];
            const completed = group[1];
            if (metrics[dispatched] !== metrics[completed]) {
                console.log((0, deps_js_1.bgRed)(`${metrics[dispatched]} ${dispatched} ` +
                    `!== ${metrics[completed]} ${completed}`));
                noOpsInProgress = false;
            }
        });
        return noOpsInProgress;
    }
    exports.checkOps = checkOps;
    function sanitize() {
        const noOpenedRessource = checkResources();
        const noOpsInProgress = checkOps();
        return noOpenedRessource && noOpsInProgress;
    }
    exports.sanitize = sanitize;
});
