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
                acc[word] = { [word]: word };
            }
            return acc;
        }, {});
    }
    handler(func) {
        return (dependencies) => {
            return func(...dependencies);
        };
    }
}
exports.Ryle = Ryle;
const RyleFunction = function (clause) {
    return new Ryle(clause);
};
RyleFunction.register = Ryle.register;
exports.default = RyleFunction;
