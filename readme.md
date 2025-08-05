# RyleJS

RyleJS is a library for creating rules in a structured and type-safe way, allowing developers to define game mechanics or other logic using a simple text-based syntax.

## Features

-   **Type Safety**: Leverage TypeScript's type system to catch errors at compile time.
-   **Simplicity**: Define complex rules using a straightforward syntax.
-   **Extensibility**: Easily extend the library with custom rule types and logic.

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

// Create a rule
const levelUpRule = Ryle("When [player] levels up, gain experience");

// Create a handler
const handler = levelUpRule.handler((player: InstanceType<typeof Player>) => {
    player.experience += 100;
    console.log(`${player.name} gained experience!`);
});

// Usage
const hero = new Player("Hero", 1);
handler([hero]); // "Hero gained experience!"
```
