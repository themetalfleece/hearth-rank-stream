import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';
import { IPlayer, IPlayerAttributes, PlayerSchema } from './Players';

export interface IGameAttributes {
    players: IPlayer[];
}

export interface IGameDocument extends Document, IGameAttributes { }

export interface IGame extends IGameDocument {
    addPlayer: (player: IPlayerAttributes) => PromiseLike<void>;
    removePlayer: (playerId: string) => PromiseLike<void>;
    incrementPlayerScore: (playerId: string, by: number) => PromiseLike<IPlayer>;
}

export interface IGameModel extends Model<IGame> { }

const GameSchema: Schema = new Schema({
    players: {
        type: [PlayerSchema],
        required: true,
    },
});

GameSchema.methods.addPlayer = async function (player: IPlayerAttributes) {
    const game = this as IGame;
    this.players.push(player);
    await game.save();
};

GameSchema.methods.removePlayer = async function (playerId: string) {
    const game = this as IGame;

    const playerToRemove = game.players.find((player) => player._id.equals(playerId));

    if (!playerToRemove) {
        throw new Error(`Player not found`);
    }

    game.players = game.players.filter((player) => player !== playerToRemove);

    await this.save();
};

GameSchema.methods.incrementPlayerScore = async function (playerId: string, by: number) {
    const game = this as IGame;

    const player = game.players.find((player) => player._id.equals(playerId));

    if (!player) {
        throw new Error(`Player not found`);
    }

    player.incrementScore(by);

    await this.save();
    return player;
};

export const Games = mongoose.model<IGame, IGameModel>('Games', GameSchema);

