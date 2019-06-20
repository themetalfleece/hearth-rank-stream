import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';
import { IUser, IUserAttributes, UserSchema } from './Users';

export interface ILobbyAttributes {
    users: IUser[];
}

export interface ILobbyDocument extends Document, ILobbyAttributes { }

export interface ILobby extends ILobbyDocument {
    addUser: (user: IUserAttributes) => PromiseLike<void>;
    removeUser: (userId: string) => PromiseLike<void>;
    incrementUserScore: (userId: string, by: number) => PromiseLike<IUser>;
}

export interface ILobbyModel extends Model<ILobby> { }

const LobbySchema: Schema = new Schema({
    users: {
        type: [UserSchema],
        required: true,
    },
});

LobbySchema.methods.addUser = async function (user: IUserAttributes) {
    const lobby = this as ILobby;
    this.users.push(user);
    await lobby.save();
};

LobbySchema.methods.removeUser = async function (userId: string) {
    const lobby = this as ILobby;

    const userToRemove = lobby.users.find((user) => user._id.equals(userId));

    if (!userToRemove) {
        throw new Error(`User not found`);
    }

    lobby.users = lobby.users.filter((user) => user !== userToRemove);

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

export const Lobbies = mongoose.model<ILobby, ILobbyModel>('Lobbies', LobbySchema);
