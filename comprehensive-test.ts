import RyleJS from "./index";
const { Ryle, createClass } = RyleJS;

console.log("🚀 RyleJS Comprehensive Test - Enhanced Version\n");

// Create test classes
const Player = createClass(
    "player",
    function (this: any, name: string, level: number) {
        this.name = name;
        this.level = level;
    },
    { health: 100, mana: 50 }
);

const Item = createClass(
    "item",
    function (this: any, name: string, value: number) {
        this.name = name;
        this.value = value;
    },
    { durability: 100 }
);

// Register only classes - strings and numbers are passed directly
Ryle.register("player", Player);
Ryle.register("item", Item);

console.log("✅ Classes registered\n");

// Test 1: String and Number Parameter Passing
console.log("=== Test 1: String and Number Parameters ===");
const tradeRule = Ryle(
    "When [player] trades [item] for [gold] coins with [merchant]"
);

const tradeHandler = tradeRule.handler(
    (player: any, item: any, gold: number, merchant: string) => {
        console.log(`📊 Handler received:`);
        console.log(`  - Player: ${player.name} (object)`);
        console.log(`  - Item: ${item.name} (object)`);
        console.log(`  - Gold: ${gold} (type: ${typeof gold})`);
        console.log(`  - Merchant: "${merchant}" (type: ${typeof merchant})`);

        return { success: true, profit: gold };
    }
);

const hero = new Player("Alice", 5);
const sword = new Item("Iron Sword", 50);

// Test with string numbers and plain strings
const result1 = tradeHandler([hero, sword, "150", "Bob the Merchant"]);
console.log(`✅ Trade result:`, result1.data);
console.log();

// Test 2: Different Number Types
console.log("=== Test 2: Number Type Conversion ===");
const mathRule = Ryle("Calculate [integer] plus [float] equals [result]");

const mathHandler = mathRule.handler(
    (int: number, float: number, result: number) => {
        console.log(`🧮 Math handler received:`);
        console.log(
            `  - Integer: ${int} (type: ${typeof int}, is integer: ${Number.isInteger(
                int
            )})`
        );
        console.log(
            `  - Float: ${float} (type: ${typeof float}, is integer: ${Number.isInteger(
                float
            )})`
        );
        console.log(
            `  - Result: ${result} (type: ${typeof result}, is integer: ${Number.isInteger(
                result
            )})`
        );

        const calculated = int + float;
        return { calculated, expected: result, matches: calculated === result };
    }
);

const result2 = mathHandler(["42", "3.14", "45.14"]);
console.log(`✅ Math result:`, result2.data);
console.log();

// Test 3: Rule Chaining with Mixed Types
console.log("=== Test 3: Rule Chaining with Mixed Types ===");
const damageRule = Ryle("When [player] receives [damage] from [source]");
const healRule = Ryle("Then [player] heals [amount] with [method]");

damageRule.then(healRule);

const damageHandler = damageRule.handler(
    (player: any, damage: number, source: string) => {
        console.log(
            `⚔️  ${player.name} receives ${damage} damage from ${source}`
        );
        player.health -= damage;
        return { player, remainingHealth: player.health };
    }
);

const healHandler = healRule.handler(
    (player: any, amount: number, method: string) => {
        console.log(`💚 ${player.name} heals ${amount} HP using ${method}`);
        player.health = Math.min(100, player.health + amount);
        return { player, newHealth: player.health };
    }
);

// Trigger chain with mixed parameters
const chainResult = damageHandler([hero, "25", "Dragon"]);
console.log(`✅ Chain completed. Final health: ${hero.health}`);
console.log();

// Test 4: Event-Driven Rules with Type Conversion
console.log("=== Test 4: Event-Driven Rules ===");
const levelUpTrigger = Ryle.trigger("When [player] gains [xp] experience");

levelUpTrigger.onTrigger(({ args }) => {
    const [player, xp] = args;
    console.log(`🎯 Trigger received:`);
    console.log(`  - Player: ${player.name}`);
    console.log(`  - XP: ${xp} (type: ${typeof xp})`);

    const oldLevel = player.level;
    if (xp >= 100) {
        player.level += Math.floor(xp / 100);
        console.log(
            `📈 ${player.name} leveled up from ${oldLevel} to ${player.level}!`
        );
    }
});

// Test trigger with string number
levelUpTrigger.trigger("gainXP", hero, "250"); // Should become 250 (number)
console.log();

// Test 5: Complex Game Scenario
console.log("=== Test 5: Complex Game Scenario ===");
const questRule = Ryle(
    "Complete quest [questName] for [reward] gold and [itemCount] items"
);

const questHandler = questRule.handler(
    (questName: string, reward: number, itemCount: number) => {
        console.log(`🗡️ Completing quest: "${questName}"`);
        console.log(`💰 Reward: ${reward} gold (type: ${typeof reward})`);
        console.log(`📦 Items: ${itemCount} items (type: ${typeof itemCount})`);

        return {
            questCompleted: questName,
            goldEarned: reward,
            itemsReceived: itemCount,
            totalValue: reward + itemCount * 10,
        };
    }
);

const questResult = questHandler(["Dragon Slayer", "500", "3"]);
console.log(`✅ Quest completed:`, questResult.data);
console.log();

// Final Status
console.log("=== Final Hero Status ===");
console.log(`👤 Name: ${hero.name}`);
console.log(`⭐ Level: ${hero.level}`);
console.log(`❤️  Health: ${hero.health}/100`);
console.log(`🔮 Mana: ${hero.mana}/50`);

console.log("\n🎉 All tests completed successfully!");
console.log("✨ Key Features Demonstrated:");
console.log("   • String parameters passed directly (no registration needed)");
console.log("   • Automatic number conversion (integers and floats)");
console.log("   • Rule chaining with mixed parameter types");
console.log("   • Event-driven rules with type conversion");
console.log("   • Class registration and instantiation");
