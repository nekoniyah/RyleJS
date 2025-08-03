export default function createClass(name, constructor, properties = {}) {
    var _a;
    let constructorBody = "";
    let parameterNames = [];
    if (constructor) {
        const funcStr = constructor.toString();
        // Extract parameter names
        const paramMatch = funcStr.match(/function\s*\([^)]*\)\s*\{|^\([^)]*\)\s*=>/);
        if (paramMatch) {
            const paramStr = ((_a = paramMatch[0].match(/\(([^)]*)\)/)) === null || _a === void 0 ? void 0 : _a[1]) || "";
            parameterNames = paramStr
                .split(",")
                .map((p) => p.trim().split(":")[0].trim())
                .filter((p) => p && p !== "this");
        }
        // Extract body
        constructorBody = funcStr.replace(/^function\s*\([^)]*\)\s*\{|\}$/g, "");
    }
    const propertyAssignments = properties
        ? Object.entries(properties)
            .map(([key, value]) => `this.${key} = ${JSON.stringify(value)};`)
            .join("\n                    ")
        : "";
    // Prevent eval for security and performance reasons
    if (constructorBody.includes("eval") ||
        propertyAssignments.includes("eval")) {
        throw new Error("Constructor or properties cannot contain 'eval'.");
    }
    if (!name.match(/^[a-zA-Z0-9_]+$/)) {
        throw new Error(`Invalid class name: ${name}`);
    }
    const paramList = parameterNames.length > 0 ? parameterNames.join(", ") : "";
    const CapitalizedClassName = (name.charAt(0).toUpperCase() +
        name.slice(1));
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
//# sourceMappingURL=createClass.js.map