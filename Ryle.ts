// Convert text that has words in brackets into a more structured format

import { type CGen } from "./createClass";
import EventEmitter from "events";

const registeredClass = new Map<string, CGen<[...args: any[]]>>();

// Helper type to extract the registered class constructors as a type map
type RegisteredClassMap = {
    [K in string]: new (...args: any[]) => { readonly __className: string };
};

// Convert the text with words in brackets to an array of words
export type RyleArray<T extends string> =
    T extends `${infer _Start}[${infer Word}]${infer _End}`
        ? [Word, ...RyleArray<`${_End}`>]
        : [];

// Should convert "this is a [test]" to {test: Test}
export type RyleConvert<
    T extends RyleArray<C>,
    C extends string = string,
    RCM extends RegisteredClassMap = RegisteredClassMap
> = {
    [K in T[number]]: K extends keyof RCM ? RCM[K] : { [key in K]: K };
};

// Should convert {test: Test} to [Test] without need for the clause string, inspired RulexConvert
// This type converts an object of constructors to their instance types as a proper tuple
export type RyleObjectToFunctionParams<
    T extends Record<string, any>,
    Keys extends readonly (keyof T)[] = (keyof T)[]
> = {
    [K in keyof Keys]: Keys[K] extends keyof T
        ? T[Keys[K]] extends new (...args: any[]) => infer R
            ? R
            : T[Keys[K]]
        : never;
};

// Helper to convert RulexArray to tuple of instance types in order
export type ArrayToInstanceTuple<
    Arr extends readonly string[],
    RegisteredMap extends Record<string, any>
> = {
    [K in keyof Arr]: Arr[K] extends keyof RegisteredMap
        ? RegisteredMap[Arr[K]] extends new (...args: any[]) => infer R
            ? R
            : RegisteredMap[Arr[K]]
        : { [key in Arr[K]]: Arr[K] };
};

type RyleConverted<C extends string> = RyleConvert<
    RyleArray<C>,
    C,
    RegisteredClassMap
>;

type DefaultEventTypes = {
    [key: string]: any;
};

export class Ryle<
    C extends string = string,
    EventTypes extends DefaultEventTypes = DefaultEventTypes
> extends EventEmitter<EventTypes> {
    static register<
        N extends string,
        D extends new (...args: any[]) => {
            readonly __className: string;
        }
    >(variable: N, definition: D): D;

    static register(
        variable: string,
        definition: new (...args: any[]) => any
    ): new (...args: any[]) => any;

    static register(
        variable: string,
        definition: new (...args: any[]) => {
            readonly __className: string;
        }
    ) {
        registeredClass.set(variable, definition);
        return definition;
    }

    public data: RyleArray<C>;
    constructor(clause: C);
    constructor(clause: string);

    constructor(public clause: string) {
        super();

        this.data = this.array(clause as C);
        this.clause = clause as C;
    }

    array(clause: C): RyleArray<C>;
    array(clause: string): RyleArray<C>;
    array(clause: string) {
        const matches = clause.match(/\[([^\]]+)\]/g);
        if (!matches) return [] as RyleArray<C>;

        return matches.map((match) => match.slice(1, -1)) as RyleArray<C>;
    }

    convert(): RyleConverted<C>;

    convert() {
        let words = this.array(this.clause as C);

        // Should return {test: Test} - test is the word in brackets, Test is the class registered for it
        return words.reduce((acc, word) => {
            if (registeredClass.has(word)) {
                //@ts-ignore
                acc[word] = registeredClass.get(word) as any;
            } else {
                //@ts-ignore
                acc[word] = { [word]: word };
            }
            return acc;
        }, {} as RyleConverted<C>);
    }

    handler<T extends readonly any[]>(
        func: (...args: T) => any | void
    ): any | void;

    handler(func: (...args: any[]) => any | void): any | void;

    handler(func: (...args: any[]) => any | void) {
        return (dependencies: any) => {
            return func(...dependencies);
        };
    }
}

const RyleFunction: {
    register: typeof Ryle.register;
    <C extends string>(clause: C): Ryle<C>;
} = function <C extends string>(clause: C): Ryle<C> {
    return new Ryle(clause);
};

RyleFunction.register = Ryle.register;

export default RyleFunction;
