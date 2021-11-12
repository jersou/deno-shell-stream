import { close } from "./close.js";
export const toArray = () => async (shellStream) => (await close()(shellStream)).out;
