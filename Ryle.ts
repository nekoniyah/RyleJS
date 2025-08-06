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
    [K in T[number]]: K extends keyof RCM ? RCM[K] : string; // Support plain strings as fallback
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
    trigger: [{ ryle: Ryle; args: any[] }];
    chain: [{ from: Ryle; to: Ryle }];
    resolve: [{ result: any }];
    [key: string]: any[];
};

export interface RyleChainOptions {
    autoEmit?: boolean;
    preserveContext?: boolean;
}

export class Ryle<
    C extends string = string,
    EventTypes extends Record<string, any[]> = Record<string, any[]>
> extends EventEmitter {
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
    public chains: Ryle[] = [];
    private _resolved: boolean = false;
    private _context: any = null;

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
                acc[word] = word; // Plain string fallback
            }
            return acc;
        }, {} as RyleConverted<C>);
    }

    // Resolve dependencies - converts parameters to their proper types
    resolve(...args: any[]): any[] {
        const words = this.array(this.clause as C);

        return words.map((word, index) => {
            const arg = args[index];

            if (registeredClass.has(word)) {
                // If it's a registered class, return the argument as-is (should be an instance)
                return arg;
            } else {
                // Handle strings and numbers
                if (typeof arg === "string") {
                    // Try to convert to number if it's a valid number string
                    const num = Number(arg);
                    if (!isNaN(num) && arg.trim() !== "") {
                        // Return integer if it's a whole number, float otherwise
                        return Number.isInteger(num) ? parseInt(arg, 10) : num;
                    }
                    return arg; // Return as string
                } else if (typeof arg === "number") {
                    // Ensure numbers are properly typed (convert to int if whole number)
                    return Number.isInteger(arg) ? Math.floor(arg) : arg;
                }
                return arg;
            }
        });
    }

    handler<T extends readonly any[]>(
        func: (...args: T) => any | void
    ): any | void;

    handler(func: (...args: any[]) => any | void): any | void;

    handler(func: (...args: any[]) => any | void) {
        return (dependencies: any) => {
            // Resolve dependencies to proper types (numbers, strings, instances)
            const resolvedDeps = this.resolve(...dependencies);
            const result = func(...resolvedDeps);
            this._resolved = true;
            this._context = result;

            // Emit resolve event
            this.emit("resolve", { result });

            // Auto-trigger chains if enabled
            this.chains.forEach((chainedRyle) => {
                if (chainedRyle.listenerCount("trigger") > 0) {
                    chainedRyle.emit("trigger", {
                        ryle: this,
                        args: resolvedDeps,
                    });
                }
            });

            return {
                data: result,
                ryle: this,
            };
        };
    }

    // Chaining methods
    chain<NC extends string>(
        nextRyle: Ryle<NC>,
        options: RyleChainOptions = {}
    ): Ryle<NC> {
        this.chains.push(nextRyle);
        this.emit("chain", { from: this, to: nextRyle });

        if (options.autoEmit !== false) {
            // Set up automatic triggering
            this.on("resolve", (data: { result: any }) => {
                nextRyle.emit("trigger", { ryle: this, args: [data.result] });
            });
        }

        return nextRyle;
    }

    then<NC extends string>(nextRyle: Ryle<NC>): Ryle<NC> {
        return this.chain(nextRyle, { autoEmit: true });
    }

    // Trigger-based methods for game events
    trigger(eventName: string, ...args: any[]): this {
        // Resolve arguments to proper types before emitting
        const resolvedArgs = this.resolve(...args);
        this.emit("trigger", { ryle: this, args: resolvedArgs });
        return this;
    }

    onTrigger(callback: (data: { ryle: Ryle; args: any[] }) => void): this {
        this.on("trigger", callback);
        return this;
    }

    // Game-specific helper methods
    whenever(condition: string): this {
        // This is a semantic helper - the actual condition logic would be implemented by the game server
        this.clause = `Whenever ${condition}, ${this.clause}`;
        return this;
    }

    // Static method to create trigger-based rules
    static trigger<C extends string>(clause: C): Ryle<C> {
        const ryle = new Ryle(clause);
        return ryle;
    }

    // Method to bind this Ryle to an EventEmitter (like a game server)
    bindTo(emitter: EventEmitter, eventName: string): this {
        emitter.on(eventName, (...args: any[]) => {
            this.trigger(eventName, ...args);
        });
        return this;
    }

    // Check if this rule has been resolved
    get resolved(): boolean {
        return this._resolved;
    }

    // Get the last resolved context
    get context(): any {
        return this._context;
    }

    // Reset the rule state
    reset(): this {
        this._resolved = false;
        this._context = null;
        return this;
    }
}

const RyleFunction: {
    register: typeof Ryle.register;
    trigger: typeof Ryle.trigger;
    <C extends string>(clause: C): Ryle<C>;
} = function <C extends string>(clause: C): Ryle<C> {
    return new Ryle(clause);
};

RyleFunction.register = Ryle.register;
RyleFunction.trigger = Ryle.trigger;

export default RyleFunction;
