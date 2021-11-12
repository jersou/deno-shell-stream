import { filter } from "./filter.js";
export const grep = (regex) => (shellStream) => filter((line) => regex.test(line))(shellStream);
