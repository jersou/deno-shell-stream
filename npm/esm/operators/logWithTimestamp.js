import { tap } from "./tap.js";
export const logWithTimestamp = () => (shellStream) => tap((line) => {
    console.log(`${new Date().toISOString()} ${line}`);
})(shellStream);
