import { bgRed } from "./deps.ts";

const stdRes = ["stdin", "stderr", "stdout"];

export function checkResources() {
  const res = Deno.resources();
  if (
    Object.keys(res).length !== 3 &&
    Object.values(res).filter((v) => !stdRes.includes(v)).length > 0
  ) {
    console.log(
      bgRed("Some resources are not closed except stdin/stderr/stdout :"),
    );
    console.log(res);
  }
}

export function checkOps() {
  const metrics = Deno.metrics();

  const opsMetricsNameGroups: [keyof Deno.Metrics, keyof Deno.Metrics][] = [
    ["opsDispatched", "opsCompleted"],
    ["opsDispatched", "opsCompleted"],
    ["opsDispatchedSync", "opsCompletedSync"],
    ["opsDispatchedAsync", "opsCompletedAsync"],
    ["opsDispatchedAsyncUnref", "opsCompletedAsyncUnref"],
  ];

  opsMetricsNameGroups.forEach((group) => {
    const dispached = group[0];
    const completed = group[1];
    if (metrics[dispached] !== metrics[completed]) {
      console.log(
        bgRed(
          `${metrics[dispached]} ${dispached} ` +
            `!== ${metrics[completed]} ${completed}`,
        ),
      );
    }
  });
}

export function sanitize() {
  checkResources();
  checkOps();
}
