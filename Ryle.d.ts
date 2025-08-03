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
export declare class Ryle<C extends string = string> {
    clause: C;
    data: RyleArray<C>;
    static register<N extends string, D extends new (...args: any[]) => {
        readonly __className: string;
    }>(variable: N, definition: D): D;
    constructor(clause: C, data?: RyleArray<C>);
    array(clause: C): RyleArray<C>;
    convert(): RyleConvert<RyleArray<C>, C, RegisteredClassMap>;
    handler<T extends readonly any[]>(func: (...args: T) => any | void): (dependencies: T) => any;
}
declare const RyleFunction: {
    register: typeof Ryle.register;
    (clause: string): Ryle;
};
export default RyleFunction;
//# sourceMappingURL=Ryle.d.ts.map