# Usage Examples for Rulex

## Basic Usage

```javascript
import Rulex from "bloomjs/Rulex";
const rule = new Rulex("Whenever [player] clicks");
console.log(rule.toString()); // Outputs: "Whenever [player] clicks"
```

## Advanced Usage

```javascript
import Rulex from "bloomjs/Rulex";

// Define the Player class

class Player {
    constructor(name) {
        this.name = name;
    }
}

Rulex.register("player", Player);

const rule = new Rulex("Whenever [player] clicks");
console.log(rule.convert()); // Outputs: { player: Player }

// This triggers immediately the rule.
rule.effect(
    (player) => {
        console.log(`${player.name} clicked!`);
    },
    [new Player("John")]
);
```

# Rulex Documentation

Rulex is a powerful DSL for defining game rules in BloomJS. It allows you to create rules in a natural language format and convert them into executable JavaScript functions.

## Functions

-   **`new Rulex(clause: string)`** : Creates a new Rulex instance with the specified clause.
-   **`Rulex.register(variable: string, definition: Class)`** : Registers a variable with a class definition for use in rules.
-   **`Rulex.prototype.toString()`** : Returns the string representation of the rule.
-   **`Rulex.prototype.convert()`** : transforms the clause into an object of the registered classes.
