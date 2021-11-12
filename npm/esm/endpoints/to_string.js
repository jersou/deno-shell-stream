import { close } from "./close.js";
export const toString = () => async (shellStream) => (await close()(shellStream)).out.join("\n");
