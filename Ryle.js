// Convert text that has words in brackets into a more structured format
import {} from "./createClass";
const registeredClass = new Map();
export class Ryle {
    static register(variable, definition) {
        registeredClass.set(variable, definition);
        return definition;
    }
    constructor(clause, data = this.array(clause)) {
        this.clause = clause;
        this.data = data;
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
const RyleFunction = function (clause) {
    return new Ryle(clause);
};
RyleFunction.register = Ryle.register;
export default RyleFunction;
//# sourceMappingURL=Ryle.js.map