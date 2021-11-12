import { map } from "./map.js";
export const replace = (searchValue, replacer) => (shellStream) => {
    return map((line) => {
        if (typeof replacer === "string") {
            return line.replace(searchValue, replacer);
        }
        else {
            return line.replace(searchValue, replacer);
        }
    })(shellStream);
};
