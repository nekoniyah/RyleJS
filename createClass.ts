type Capitalize<T extends string> = T extends `${infer First}${infer Rest}`
    ? `${Uppercase<First>}${Rest}`
    : T;

export type CGen<
    P extends [...any[]] = [],
    U extends { [key: string]: any } = {},
    T extends string = string
> = {
    [K in T]: new (...args: P) => {
        readonly __className: K;
    } & U;
}[T];

export type ConstructorFunction<Args extends any[] = []> = (
    this: any,
    ...args: Args
) => void;

export default function createClass<
    P extends { [key: string]: any } = {},
    T extends string = string,
    C extends (this: any, ...args: any[]) => ReturnType<C> = ConstructorFunction
>(
    name: T,
    constructor: C,
    properties: P = {} as P
): CGen<Parameters<C>, P, Capitalize<T>> {
    let constructorBody = "";
    let parameterNames: string[] = [];

    if (constructor) {
        const funcStr = constructor.toString();
        // Extract parameter names
        const paramMatch = funcStr.match(
            /function\s*\([^)]*\)\s*\{|^\([^)]*\)\s*=>/
        );
        if (paramMatch) {
            const paramStr = paramMatch[0].match(/\(([^)]*)\)/)?.[1] || "";
            parameterNames = paramStr
                .split(",")
                .map((p) => p.trim().split(":")[0]!.trim())
                .filter((p) => p && p !== "this");
        }
        // Extract body
        constructorBody = funcStr.replace(
            /^function\s*\([^)]*\)\s*\{|\}$/g,
            ""
        );
    }

    const propertyAssignments = properties
        ? Object.entries(properties)
              .map(([key, value]) => `this.${key} = ${JSON.stringify(value)};`)
              .join("\n                    ")
        : "";

    // Prevent eval for security and performance reasons
    if (
        constructorBody.includes("eval") ||
        propertyAssignments.includes("eval")
    ) {
        throw new Error("Constructor or properties cannot contain 'eval'.");
    }

    if (!name.match(/^[a-zA-Z0-9_]+$/)) {
        throw new Error(`Invalid class name: ${name}`);
    }

    const paramList =
        parameterNames.length > 0 ? parameterNames.join(", ") : "";

    const CapitalizedClassName: Capitalize<T> = (name.charAt(0).toUpperCase() +
        name.slice(1)) as Capitalize<T>;

    return eval(`
        (function() {
            class ${CapitalizedClassName} {
                get __className() { return "${CapitalizedClassName}"; }
                constructor(${paramList}) {
                    ${propertyAssignments}
                    ${constructorBody}
                }
            }
            return ${CapitalizedClassName};
        })()
    `);
}
