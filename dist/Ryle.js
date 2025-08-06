"use strict";
// Convert text that has words in brackets into a more structured format
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ryle = void 0;
const events_1 = __importDefault(require("events"));
const registeredClass = new Map();
class Ryle extends events_1.default {
    static register(variable, definition) {
        registeredClass.set(variable, definition);
        return definition;
    }
    constructor(clause) {
        super();
        this.clause = clause;
        this.chains = [];
        this._resolved = false;
        this._context = null;
        this.data = this.array(clause);
        this.clause = clause;
    }
    array(clause) {
        const matches = clause.match(/\[([^\]]+)\]/g);
        if (!matches)
            return [];
        return matches.map((match) => match.slice(1, -1));
    }
    convert() {
        let words = this.array(this.clause);
        // Should return {test: Test} - test is the word in brackets, Test is the class registered for it
        return words.reduce((acc, word) => {
            if (registeredClass.has(word)) {
                //@ts-ignore
                acc[word] = registeredClass.get(word);
            }
            else {
                //@ts-ignore
                acc[word] = word; // Plain string fallback
            }
            return acc;
        }, {});
    }
    // Resolve dependencies - converts parameters to their proper types
    resolve(...args) {
        const words = this.array(this.clause);
        return words.map((word, index) => {
            const arg = args[index];
            if (registeredClass.has(word)) {
                // If it's a registered class, return the argument as-is (should be an instance)
                return arg;
            }
            else {
                // Handle strings and numbers
                if (typeof arg === 'string') {
                    // Try to convert to number if it's a valid number string
                    const num = Number(arg);
                    if (!isNaN(num) && arg.trim() !== '') {
                        // Return integer if it's a whole number, float otherwise
                        return Number.isInteger(num) ? parseInt(arg, 10) : num;
                    }
                    return arg; // Return as string
                }
                else if (typeof arg === 'number') {
                    // Ensure numbers are properly typed (convert to int if whole number)
                    return Number.isInteger(arg) ? Math.floor(arg) : arg;
                }
                return arg;
            }
        });
    }
    handler(func) {
        return (dependencies) => {
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
    chain(nextRyle, options = {}) {
        this.chains.push(nextRyle);
        this.emit("chain", { from: this, to: nextRyle });
        if (options.autoEmit !== false) {
            // Set up automatic triggering
            this.on("resolve", (data) => {
                nextRyle.emit("trigger", { ryle: this, args: [data.result] });
            });
        }
        return nextRyle;
    }
    then(nextRyle) {
        return this.chain(nextRyle, { autoEmit: true });
    }
    // Trigger-based methods for game events
    trigger(eventName, ...args) {
        // Resolve arguments to proper types before emitting
        const resolvedArgs = this.resolve(...args);
        this.emit("trigger", { ryle: this, args: resolvedArgs });
        return this;
    }
    onTrigger(callback) {
        this.on("trigger", callback);
        return this;
    }
    // Game-specific helper methods
    whenever(condition) {
        // This is a semantic helper - the actual condition logic would be implemented by the game server
        this.clause = `Whenever ${condition}, ${this.clause}`;
        return this;
    }
    // Static method to create trigger-based rules
    static trigger(clause) {
        const ryle = new Ryle(clause);
        return ryle;
    }
    // Method to bind this Ryle to an EventEmitter (like a game server)
    bindTo(emitter, eventName) {
        emitter.on(eventName, (...args) => {
            this.trigger(eventName, ...args);
        });
        return this;
    }
    // Check if this rule has been resolved
    get resolved() {
        return this._resolved;
    }
    // Get the last resolved context
    get context() {
        return this._context;
    }
    // Reset the rule state
    reset() {
        this._resolved = false;
        this._context = null;
        return this;
    }
}
exports.Ryle = Ryle;
const RyleFunction = function (clause) {
    return new Ryle(clause);
};
RyleFunction.register = Ryle.register;
RyleFunction.trigger = Ryle.trigger;
exports.default = RyleFunction;
