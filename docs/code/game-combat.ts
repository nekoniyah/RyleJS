import RyleJS from "rylejs";
const { Ryle, createClass } = RyleJS;

// Create game entities
const Player = createClass(
    "player",
    function (name: string, level: number) {
        this.name = name;
        this.level = level;
    },
    {
        health: 100,
        attack: 10,
        defense: 5,
        experience: 0,
    }
);

const Enemy = createClass(
    "enemy",
    function (name: string, difficulty: number) {
        this.name = name;
        this.difficulty = difficulty;
    },
    {
        health: 50,
        attack: 8,
        defense: 3,
        experienceReward: 25,
    }
);

// Register classes
Ryle.register("player", Player);
Ryle.register("enemy", Enemy);

// Create combat rules
const attackRule = Ryle("When [player] attacks [enemy]");
const defeatRule = Ryle("When [player] defeats [enemy]");

// Create handlers
const attackHandler = attackRule.handler(
    (
        player: InstanceType<typeof Player>,
        enemy: InstanceType<typeof Enemy>
    ) => {
        const damage = Math.max(1, player.attack - enemy.defense);
        enemy.health -= damage;
        console.log(`${player.name} deals ${damage} damage to ${enemy.name}`);

        if (enemy.health <= 0) {
            console.log(`${enemy.name} is defeated!`);
            return "defeated";
        }
        return "continue";
    }
);

const defeatHandler = defeatRule.handler(
    (
        player: InstanceType<typeof Player>,
        enemy: InstanceType<typeof Enemy>
    ) => {
        player.experience += enemy.experienceReward;
        console.log(
            `${player.name} gains ${enemy.experienceReward} experience!`
        );

        // Check for level up
        if (player.experience >= player.level * 100) {
            player.level++;
            player.health = 100; // Restore health on level up
            player.attack += 2;
            player.defense += 1;
            console.log(`${player.name} reached level ${player.level}!`);
        }
    }
);

// Usage
const hero = new Player("Hero", 1);
const goblin = new Enemy("Goblin", 1);

const result = attackHandler([hero, goblin]);
if (result === "defeated") {
    defeatHandler([hero, goblin]);
}
