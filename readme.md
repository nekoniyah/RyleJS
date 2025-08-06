# RyleJS

RyleJS is a library for creating rules in a structured and type-safe way, allowing developers to define game mechanics or other logic using a simpl#### Static Methods

-   `Ryle.register(variable: string, definition: Class)` - Register a class for use in rules (strings are passed directly)
-   `Ryle.trigger(clause: string)` - Create a new trigger-based Ryle instance

#### Instance Methods

-   `array(clause: string)` - Extract bracketed words from the clause as an array
-   `convert()` - Convert bracketed words to their registered class definitions (or keep as strings)
-   `resolve(...args)` - Convert parameters to proper types (strings to strings, number strings to numbers, classes to instances)
-   `handler(func: Function)` - Create a handler function for the rule with automatic type conversion
-   `chain(nextRyle: Ryle, options?)` - Chain another Ryle instance to execute after this one
-   `then(nextRyle: Ryle)` - Alias for `chain()` with auto-emit enabled
-   `trigger(eventName: string, ...args)` - Manually trigger the rule with custom arguments (auto-converts types)
-   `onTrigger(callback: Function)` - Listen for trigger events
-   `bindTo(emitter: EventEmitter, eventName: string)` - Bind this rule to an external EventEmitter
-   `whenever(condition: string)` - Semantic helper to create trigger-style clausestax.

## Features

-   **Type Safety**: Leverage TypeScript's type system to catch errors at compile time.
-   **Simplicity**: Define complex rules using a straightforward syntax.
-   **Extensibility**: Easily extend the library with custom rule types and logic.
-   **Chaining**: Chain multiple Ryle instances together for complex rule composition.
-   **EventEmitter Integration**: Built-in event system for game triggers and reactive programming.
-   **String Parameter Support**: Register and use plain strings as parameters, not just classes.
-   **Game-Friendly**: Designed with game mechanics in mind, supporting triggers like "Whenever [player] gains life".

## Installation

-   Using Bun:

```bash
bun add rylejs
```

-   Using npm:

```bash
npm install rylejs
```

## Quick Example

```typescript
import RyleJS from "rylejs";
const { Ryle, createClass } = RyleJS;

// Create a Player class
const Player = createClass(
    "player",
    function (name: string, level: number) {
        this.name = name;
        this.level = level;
    },
    {
        health: 100,
        experience: 0,
    }
);

// Register the class
Ryle.register("player", Player);

// No need to register strings - pass them directly as parameters!
// Ryle.register("action", "levelUp"); // Not needed anymore

// Create a rule
const levelUpRule = Ryle(
    "When [player] performs [action], gain [experience] points"
);

// Create a handler
const handler = levelUpRule.handler(
    (
        player: InstanceType<typeof Player>,
        action: string,
        experience: number
    ) => {
        if (action === "levelUp") {
            player.experience += experience; // experience is automatically converted to number
            console.log(`${player.name} gained ${experience} experience!`);
        }
    }
);

// Usage - pass strings and numbers directly
const hero = new Player("Hero", 1);
handler([hero, "levelUp", "100"]); // "100" becomes 100 (number)
```

## Advanced Usage

### Chaining Rules

```typescript
// Create chained rules for complex game mechanics
const damageRule = Ryle("When [player] takes damage");
const healRule = Ryle("Then [player] regenerates health");
const levelRule = Ryle("If health is full, [player] gains experience");

// Chain the rules together
damageRule.then(healRule).then(levelRule);

// Set up handlers for each rule
const damageHandler = damageRule.handler(
    (player: InstanceType<typeof Player>) => {
        player.health -= 20;
        return player;
    }
);

const healHandler = healRule.handler((player: InstanceType<typeof Player>) => {
    player.health = Math.min(100, player.health + 10);
    return player;
});

const levelHandler = levelRule.handler(
    (player: InstanceType<typeof Player>) => {
        if (player.health >= 100) {
            player.experience += 50;
        }
        return player;
    }
);
```

### Event-Driven Game Mechanics

```typescript
import { EventEmitter } from "events";

// Create a game server
class GameServer extends EventEmitter {}
const gameServer = new GameServer();

// Create trigger-based rules
const lifeGainTrigger = Ryle.trigger("Whenever [player] gains life");

// Bind the rule to the game server
lifeGainTrigger.bindTo(gameServer, "playerGainLife");

// Set up the trigger handler
lifeGainTrigger.onTrigger(({ ryle, args }) => {
    const [player, amount] = args;
    console.log(`${player.name} gained ${amount} life!`);
    // Additional game logic here
});

// Emit the event from your game server
gameServer.emit("playerGainLife", hero, 5);
```

### Working with Strings and Numbers

```typescript
// No need to register strings - pass them directly!
// Numbers in string format are automatically converted to actual numbers

const combatRule = Ryle(
    "When [player] deals [damage] to [target] with [weapon]"
);

const combatHandler = combatRule.handler(
    (player: any, damage: number, target: string, weapon: any) => {
        console.log(`${player.name} deals ${damage} damage to ${target}`);
        // damage will be a proper number even if passed as "42"
        // target will be a string like "enemy"
    }
);

// Usage - strings and numbers passed directly
const hero = new Player("Hero", 5);
const sword = new Weapon("Excalibur", 50);

// Pass numbers as strings - they get converted automatically
combatHandler([hero, "42", "enemy", sword]); // "42" becomes 42 (number)
```

## API Reference

### Ryle Class

#### Static Methods

-   `Ryle.register(variable: string, definition: Class | string)` - Register a class or string for use in rules
-   `Ryle.trigger(clause: string)` - Create a new trigger-based Ryle instance

#### Instance Methods

-   `array(clause: string)` - Extract bracketed words from the clause as an array
-   `convert()` - Convert bracketed words to their registered definitions
-   `handler(func: Function)` - Create a handler function for the rule
-   `chain(nextRyle: Ryle, options?)` - Chain another Ryle instance to execute after this one
-   `then(nextRyle: Ryle)` - Alias for `chain()` with auto-emit enabled
-   `trigger(eventName: string, ...args)` - Manually trigger the rule with custom arguments
-   `onTrigger(callback: Function)` - Listen for trigger events
-   `bindTo(emitter: EventEmitter, eventName: string)` - Bind this rule to an external EventEmitter
-   `whenever(condition: string)` - Semantic helper to create trigger-style clauses

#### Properties

-   `clause: string` - The original rule clause
-   `data: string[]` - Array of extracted bracketed words
-   `chains: Ryle[]` - Array of chained Ryle instances
-   `resolved: boolean` - Whether the rule has been resolved
-   `context: any` - The last resolved context/result

### Events

The Ryle class extends EventEmitter and emits the following events:

-   `'trigger'` - Emitted when the rule is triggered
-   `'chain'` - Emitted when a rule is chained to another
-   `'resolve'` - Emitted when the rule handler completes

### createClass Function

Creates a new class with the specified constructor and properties.

```typescript
createClass<P, T, C>(name: T, constructor: C, properties?: P): Class
```
