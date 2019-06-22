import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';
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
    lobby.users.push(user);
    await lobby.save();
    await UserKeys.create({
        lobbyId: lobby._id,
        userId: user._id,
    });
};

LobbySchema.methods.removeUser = async function (userId: string) {
    const lobby = this as ILobby;

    const userToRemove = lobby.users.find((user) => user._id.equals(userId));

    if (!userToRemove) {
        throw new Error(`User not found`);
    }

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

export const Lobbies = mongoose.model<ILobby, ILobbyModel>('Lobbies', LobbySchema);

