import { close } from "./close.js";
export const success = () => async (shellStream) => (await close()(shellStream)).success;
