import EventEmitter from "events";
type RegisteredClassMap = {
    [K in string]: new (...args: any[]) => {
        readonly __className: string;
    };
};
export type RyleArray<T extends string> = T extends `${infer _Start}[${infer Word}]${infer _End}` ? [Word, ...RyleArray<`${_End}`>] : [];
export type RyleConvert<T extends RyleArray<C>, C extends string = string, RCM extends RegisteredClassMap = RegisteredClassMap> = {
    [K in T[number]]: K extends keyof RCM ? RCM[K] : string;
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
export interface RyleChainOptions {
    autoEmit?: boolean;
    preserveContext?: boolean;
}
export declare class Ryle<C extends string = string, EventTypes extends Record<string, any[]> = Record<string, any[]>> extends EventEmitter {
    clause: string;
    static register<N extends string, D extends new (...args: any[]) => {
        readonly __className: string;
    }>(variable: N, definition: D): D;
    static register(variable: string, definition: new (...args: any[]) => any): new (...args: any[]) => any;
    data: RyleArray<C>;
    chains: Ryle[];
    private _resolved;
    private _context;
    constructor(clause: C);
    constructor(clause: string);
    array(clause: C): RyleArray<C>;
    array(clause: string): RyleArray<C>;
    convert(): RyleConverted<C>;
    resolve(...args: any[]): any[];
    handler<T extends readonly any[]>(func: (...args: T) => any | void): any | void;
    handler(func: (...args: any[]) => any | void): any | void;
    chain<NC extends string>(nextRyle: Ryle<NC>, options?: RyleChainOptions): Ryle<NC>;
    then<NC extends string>(nextRyle: Ryle<NC>): Ryle<NC>;
    trigger(eventName: string, ...args: any[]): this;
    onTrigger(callback: (data: {
        ryle: Ryle;
        args: any[];
    }) => void): this;
    whenever(condition: string): this;
    static trigger<C extends string>(clause: C): Ryle<C>;
    bindTo(emitter: EventEmitter, eventName: string): this;
    get resolved(): boolean;
    get context(): any;
    reset(): this;
}
declare const RyleFunction: {
    register: typeof Ryle.register;
    trigger: typeof Ryle.trigger;
    <C extends string>(clause: C): Ryle<C>;
};
export default RyleFunction;
