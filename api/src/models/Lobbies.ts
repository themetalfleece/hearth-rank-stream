import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';
import { ws } from '../init/websockets';
import { UserKeys } from './UserKeys';
import { IUser, IUserAttributes, Users, UserSchema } from './Users';

export interface ILobbyAttributes {
    name: string;
    users: IUser[];
}

export interface ILobbyDocument extends Document, ILobbyAttributes { }

export interface ILobby extends ILobbyDocument {
    addUser: (user: IUserAttributes) => PromiseLike<void>;
    removeUser: (userId: string) => PromiseLike<void>;
    incrementUserScore: (userId: string, by: number) => PromiseLike<IUser>;
    /** emits the lobby info to the websockets room, respecting the room level (user/mod) */
    emitLobbyInfo: () => VoidFunction;
}

export interface ILobbyModel extends Model<ILobby> { }

const LobbySchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    users: {
        type: [UserSchema],
        required: true,
    },
});

LobbySchema.methods.addUser = async function (userAttributes: IUserAttributes) {
    const lobby = this as ILobby;
    const user = new Users(userAttributes);
    // push it to the users of the lobby
    lobby.users.push(user);
    await lobby.save();
    // create the key for this user
    await UserKeys.create({
        lobbyId: lobby._id,
        userId: user._id,
        level: 'user',
    });
};

LobbySchema.methods.removeUser = async function (userId: string) {
    const lobby = this as ILobby;

    const userToRemove = lobby.users.find((user) => user._id.equals(userId));

    if (!userToRemove) {
        throw new Error(`User not found`);
    }

    // remove the user from the lobby
    lobby.users = lobby.users.filter((user) => user !== userToRemove);

    // remove their key
    await UserKeys.deleteOne({
        userId,
        lobbyId: lobby.id,
    });

    await this.save();
};

LobbySchema.methods.incrementUserScore = async function (userId: string, by: number) {
    const lobby = this as ILobby;

    const user = lobby.users.find((user) => user._id.equals(userId));

    if (!user) {
        throw new Error(`User not found`);
    }

    user.incrementScore(by);

    await this.save();
    return user;
};

LobbySchema.methods.emitLobbyInfo = async function () {
    const lobby = this as ILobby;

    // emit to both mod and user rooms, with the appropriate info
    ws.io.to(ws.getRoomName({ lobbyId: lobby.id, level: 'user' }))
        .emit('lobby-info', { lobby });

    // for mod, also include the userKeys
    const userKeys = await UserKeys.find({
        lobbyId: lobby.id,
    });
    ws.io.to(ws.getRoomName({ lobbyId: lobby.id, level: 'mod' }))
        .emit('lobby-info', { lobby, userKeys });
};

export const Lobbies = mongoose.model<ILobby, ILobbyModel>('Lobbies', LobbySchema);

