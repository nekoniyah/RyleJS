import EventEmitter from "events";
type RegisteredClassMap = {
    [K in string]: new (...args: any[]) => {
        readonly __className: string;
    };
};
export type RyleArray<T extends string> = T extends `${infer _Start}[${infer Word}]${infer _End}` ? [Word, ...RyleArray<`${_End}`>] : [];
export type RyleConvert<T extends RyleArray<C>, C extends string = string, RCM extends RegisteredClassMap = RegisteredClassMap> = {
    [K in T[number]]: K extends keyof RCM ? RCM[K] : {
        [key in K]: K;
    };
};
export type RyleObjectToFunctionParams<T extends Record<string, any>, Keys extends readonly (keyof T)[] = (keyof T)[]> = {
    [K in keyof Keys]: Keys[K] extends keyof T ? T[Keys[K]] extends new (...args: any[]) => infer R ? R : T[Keys[K]] : never;
};
export type ArrayToInstanceTuple<Arr extends readonly string[], RegisteredMap extends Record<string, any>> = {
    [K in keyof Arr]: Arr[K] extends keyof RegisteredMap ? RegisteredMap[Arr[K]] extends new (...args: any[]) => infer R ? R : RegisteredMap[Arr[K]] : {
        [key in Arr[K]]: Arr[K];
    };
};
type RyleConverted<C extends string> = RyleConvert<RyleArray<C>, C, RegisteredClassMap>;
type DefaultEventTypes = {
    [key: string]: any;
};
export declare class Ryle<C extends string = string, EventTypes extends DefaultEventTypes = DefaultEventTypes> extends EventEmitter<EventTypes> {
    clause: string;
    static register<N extends string, D extends new (...args: any[]) => {
        readonly __className: string;
    }>(variable: N, definition: D): D;
    static register(variable: string, definition: new (...args: any[]) => any): new (...args: any[]) => any;
    data: RyleArray<C>;
    constructor(clause: C);
    constructor(clause: string);
    array(clause: C): RyleArray<C>;
    array(clause: string): RyleArray<C>;
    convert(): RyleConverted<C>;
    handler<T extends readonly any[]>(func: (...args: T) => any | void): any | void;
    handler(func: (...args: any[]) => any | void): any | void;
}
declare const RyleFunction: {
    register: typeof Ryle.register;
    <C extends string>(clause: C): Ryle<C>;
};
export default RyleFunction;
