"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const { Ryle, createClass } = index_1.default;
// Create a Player class
const Player = createClass("player", function (name, level = 1) {
    this.name = name;
    this.level = level;
}, {
    health: 100,
    mana: 50,
    experience: 0,
});
// Create a Spell class
const Spell = createClass("spell", function (name, damage) {
    this.name = name;
    this.damage = damage;
}, {
    manaCost: 10,
});
// Register classes
Ryle.register("player", Player);
Ryle.register("spell", Spell);
// No need to register strings - they can be passed directly!
// Ryle.register("action", "cast");  // Remove this
// Ryle.register("target", "enemy"); // Remove this  
// Ryle.register("effect", "damage"); // Remove this
console.log("=== Basic Rule Example ===");
// Basic rule with mixed class and string/number parameters
const castRule = Ryle("When [player] performs [action] with [spell] targeting [target] for [damage]");
console.log("Rule data:", castRule.data);
console.log("Converted:", castRule.convert());
// Create a handler
const castHandler = castRule.handler((player, action, spell, target, damage) => {
    console.log(`Handler received - Action: "${action}", Target: "${target}", Damage: ${damage} (type: ${typeof damage})`);
    if (action === "cast" &&
        target === "enemy" &&
        player.mana >= spell.manaCost) {
        player.mana -= spell.manaCost;
        console.log(`${player.name} casts ${spell.name} dealing ${damage} damage to ${target}!`);
        return { damage: damage, success: true };
    }
    return { damage: 0, success: false };
});
// Test the handler with strings and numbers
const hero = new Player("Gandalf", 10);
const fireball = new Spell("Fireball", 25);
// Pass strings and numbers directly - no registration needed!
const result = castHandler([hero, "cast", fireball, "enemy", "42"]); // "42" should become integer 42
console.log("Cast result:", result);
console.log("\n=== Chaining Rules Example ===");
// Create chained rules for complex game mechanics with numbers
const damageRule = Ryle("When [player] takes [damage] points of [effect]");
const checkHealthRule = Ryle("Then check [player] health");
const healRule = Ryle("If low health, [player] uses potion healing [amount]");
// Chain the rules together
damageRule.then(checkHealthRule).then(healRule);
// Set up handlers for each rule in the chain
const damageHandler = damageRule.handler((player, damage, effect) => {
    console.log(`Damage handler received - Damage: ${damage} (type: ${typeof damage}), Effect: "${effect}"`);
    if (effect === "damage") {
        player.health -= damage;
        console.log(`${player.name} takes ${damage} damage! Health: ${player.health}`);
    }
    return player;
});
const checkHandler = checkHealthRule.handler((player) => {
    console.log(`Checking ${player.name}'s health: ${player.health}/100`);
    return player;
});
const healHandler = healRule.handler((player, amount) => {
    console.log(`Heal handler received - Amount: ${amount} (type: ${typeof amount})`);
    if (player.health < 50) {
        player.health = Math.min(100, player.health + amount);
        console.log(`${player.name} uses a potion and heals for ${amount}! Health: ${player.health}`);
    }
    return player;
});
// Test the chain with number conversion
console.log("Hero health before:", hero.health);
damageHandler([hero, "30", "damage"]); // "30" should become integer 30
console.log("\n=== Event-Driven Example ===");
// Create trigger-based rules for game events with numbers
const lifeGainTrigger = Ryle.trigger("Whenever [player] gains [amount] life");
// Set up the trigger handler  
lifeGainTrigger.onTrigger(({ args }) => {
    const [player, amount] = args;
    console.log(`Trigger received - Amount: ${amount} (type: ${typeof amount})`);
    player.health = Math.min(100, player.health + amount);
    console.log(`🎉 ${player.name} gained ${amount} life! Total health: ${player.health}`);
});
// Manual trigger with string number that gets converted
lifeGainTrigger.trigger("playerGainLife", hero, "15"); // "15" should become integer 15
console.log("\n=== Number Conversion Demo ===");
// Show different number types
const numberRule = Ryle("Convert [integer] and [float] and [text]");
const numberHandler = numberRule.handler((integer, float, text) => {
    console.log(`Integer: ${integer} (type: ${typeof integer})`);
    console.log(`Float: ${float} (type: ${typeof float})`);
    console.log(`Text: "${text}" (type: ${typeof text})`);
});
numberHandler(["42", "3.14", "hello"]); // 42 -> int, 3.14 -> float, "hello" -> string
console.log("\n=== Game Server Integration Example ===");
const events_1 = require("events");
class GameServer extends events_1.EventEmitter {
}
const gameServer = new GameServer();
// Create a rule that responds to server events
const serverTrigger = Ryle.trigger("Server event: [player] levels up");
serverTrigger.bindTo(gameServer, "levelUp");
serverTrigger.onTrigger(({ args }) => {
    const [player] = args;
    player.level += 1;
    player.experience = 0;
    player.health = 100; // Full heal on level up
    console.log(`📈 ${player.name} leveled up to level ${player.level}!`);
});
// Simulate server event
gameServer.emit("levelUp", hero);
console.log("\n=== Final Hero Stats ===");
console.log(`Name: ${hero.name}`);
console.log(`Level: ${hero.level}`);
console.log(`Health: ${hero.health}/100`);
console.log(`Mana: ${hero.mana}/50`);
console.log(`Experience: ${hero.experience}`);
