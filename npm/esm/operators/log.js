import { tap } from "./tap.js";
export const log = (transform) => (shellStream) => tap((line) => transform ? console.log(transform(line)) : console.log(line))(shellStream);
