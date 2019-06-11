import * as uuid from 'uuid';
import { Player } from './Player';

const games: {
    [id: string]: Game;
} = {};

export class Game {

    public static getById(id: string) {
        const game = games[id];
        if (!game) {
            throw new Error(`Game not found`);
        }
        return games[id];
    }

    public id: string;
    public players: Player[];

    constructor() {
        // this.id = uuid.v4();
        this.id = '0'; // TODO replace with uuid
        this.players = [];
        games[this.id] = this;
    }

    public addPlayer(player: Player) {
        this.players.push(player);
    }

    public incrementPlayerScore(playerId: string, by: number) {
        const player = this.players.find((player) => player.id === playerId);
        if (!player) {
            throw new Error(`Player not found`);
        }

        player.incrementScore(by);

        return player;
    }
}

