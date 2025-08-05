// Create item classes
const Weapon = createClass(
    "weapon",
    function (name: string, damage: number) {
        this.name = name;
        this.damage = damage;
    },
    {
        type: "weapon",
        durability: 100,
    }
);

const Potion = createClass(
    "potion",
    function (name: string, healAmount: number) {
        this.name = name;
        this.healAmount = healAmount;
    },
    {
        type: "consumable",
        quantity: 1,
    }
);

// Register items
Ryle.register("weapon", Weapon);
Ryle.register("potion", Potion);
Ryle.register("player", Player);

// Create item usage rules
const equipRule = Ryle("When [player] equips [weapon]");
const usePotionRule = Ryle("When [player] uses [potion]");

const equipHandler = equipRule.handler(
    (
        player: InstanceType<typeof Player>,
        weapon: InstanceType<typeof Weapon>
    ) => {
        const oldAttack = player.attack;
        player.attack += weapon.damage;
        console.log(
            `${player.name} equipped ${weapon.name}! Attack increased from ${oldAttack} to ${player.attack}`
        );
    }
);

const potionHandler = usePotionRule.handler(
    (
        player: InstanceType<typeof Player>,
        potion: InstanceType<typeof Potion>
    ) => {
        const oldHealth = player.health;
        player.health = Math.min(100, player.health + potion.healAmount);
        console.log(
            `${player.name} used ${potion.name}! Health restored from ${oldHealth} to ${player.health}`
        );
    }
);

// Usage
const sword = new Weapon("Iron Sword", 15);
const healthPotion = new Potion("Health Potion", 30);

equipHandler([hero, sword]);
potionHandler([hero, healthPotion]);
