import { ShellStream } from "./shell_stream.js";
export declare type StartOperator = (...args: any[]) => StartOperatorFunc;
export declare type StartOperatorFunc = () => ShellStream;
export declare type Operator = (...args: any[]) => OperatorFunc;
export declare type OperatorFunc = (shellStream: ShellStream) => ShellStream;
export declare type EndOperator<T> = (...args: any[]) => EndOperatorFunc<T>;
export declare type EndOperatorFunc<T> = (shellStream: ShellStream) => Promise<T>;
export declare type Generator = AsyncIterableIterator<string>;
