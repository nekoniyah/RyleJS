type Capitalize<T extends string> = T extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : T;
export type CGen<P extends [...any[]] = [], U extends {
    [key: string]: any;
} = {}, T extends string = string> = {
    [K in T]: new (...args: P) => {
        readonly __className: K;
    } & U;
}[T];
export type ConstructorFunction<Args extends any[] = []> = (this: any, ...args: Args) => void;
export default function createClass<P extends {
    [key: string]: any;
} = {}, T extends string = string, C extends (this: any, ...args: any[]) => ReturnType<C> = ConstructorFunction>(name: T, constructor: C, properties?: P): CGen<Parameters<C>, P, Capitalize<T>>;
export {};
