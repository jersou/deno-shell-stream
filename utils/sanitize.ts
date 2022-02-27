import { bgRed } from "../deps.ts";

const stdRes = ["stdin", "stderr", "stdout"];

export function checkResources(log = true) {
  let noOpenedRessource = true;
  const res = Deno.resources();
  if (
    Object.keys(res).length !== 3 &&
    Object.values(res).filter((v) => !stdRes.includes(v)).length > 0
  ) {
    log && console.log(
      bgRed("Some resources are not closed except stdin/stderr/stdout :"),
    );
    log && console.log(res);
    noOpenedRessource = false;
  }
  return noOpenedRessource;
}

export function checkOps(log = true) {
  let noOpsInProgress = true;
  const metrics = Deno.metrics();

  const opsMetricsNameGroups: [keyof Deno.Metrics, keyof Deno.Metrics][] = [
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
      log && console.log(
        bgRed(
          `${metrics[dispatched]} ${dispatched} ` +
            `!== ${metrics[completed]} ${completed}`,
        ),
      );
      noOpsInProgress = false;
    }
  });
  return noOpsInProgress;
}

export function sanitize(log = true) {
  const noOpenedRessource = checkResources(log);
  const noOpsInProgress = checkOps(log);
  return noOpenedRessource && noOpsInProgress;
}
