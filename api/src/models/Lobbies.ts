import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';
import { IPlayer, IPlayerAttributes, PlayerSchema } from './Players';

export interface ILobbyAttributes {
    players: IPlayer[];
}

export interface ILobbyDocument extends Document, ILobbyAttributes { }

export interface ILobby extends ILobbyDocument {
    addPlayer: (player: IPlayerAttributes) => PromiseLike<void>;
    removePlayer: (playerId: string) => PromiseLike<void>;
    incrementPlayerScore: (playerId: string, by: number) => PromiseLike<IPlayer>;
}

export interface ILobbyModel extends Model<ILobby> { }

const LobbySchema: Schema = new Schema({
    players: {
        type: [PlayerSchema],
        required: true,
    },
});

LobbySchema.methods.addPlayer = async function (player: IPlayerAttributes) {
    const lobby = this as ILobby;
    this.players.push(player);
    await lobby.save();
};

LobbySchema.methods.removePlayer = async function (playerId: string) {
    const lobby = this as ILobby;

    const playerToRemove = lobby.players.find((player) => player._id.equals(playerId));

    if (!playerToRemove) {
        throw new Error(`Player not found`);
    }

    lobby.players = lobby.players.filter((player) => player !== playerToRemove);

    await this.save();
};

LobbySchema.methods.incrementPlayerScore = async function (playerId: string, by: number) {
    const lobby = this as ILobby;

    const player = lobby.players.find((player) => player._id.equals(playerId));

    if (!player) {
        throw new Error(`Player not found`);
    }

    player.incrementScore(by);

    await this.save();
    return player;
};

export const Lobbies = mongoose.model<ILobby, ILobbyModel>('Lobbies', LobbySchema);

