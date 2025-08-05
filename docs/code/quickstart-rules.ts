// Create a rule that uses the player
const gameRule = Ryle("When [player] levels up, gain experience");

// Convert the rule to get typed dependencies
const dependencies = gameRule.convert();

// Create a handler
const levelUpHandler = gameRule.handler(
    (player: InstanceType<typeof Player>) => {
        player.experience += 100;
        console.log(`${player.name} gained experience!`);
    }
);
