class Player {
    readonly __className = "Player";
    constructor(public name: string) {}
}

Ryle.register("player", Player);
// Now 'player' can be used in rule clauses
