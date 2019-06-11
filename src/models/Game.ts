import * as uuid from 'uuid';

class Player {
    public name: string;
    public id: string;
    public score: {
        rank: number;
        stars: number;
    };
}

const games: {
    [id: string]: Game;
} = {};

export class Game {

    public static getById(id: string) {
        return games[id];
    }

    public id: string;
    public players: Player[];

    constructor() {
        this.id = uuid.v4();
        this.players = [];
        games[this.id] = this;
    }
}

