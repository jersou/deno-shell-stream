import { map } from "./map.js";
export const cut = (delim, indexes, sep = " ") => (shellStream) => map((line) => {
    const parts = line.split(delim);
    return indexes.map((i) => parts[i]).join(sep);
})(shellStream);
