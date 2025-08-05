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
