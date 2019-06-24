import * as randomString from 'crypto-random-string';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

export interface IUserKeyAttributes {
    userId?: mongoose.Types.ObjectId;
    lobbyId: mongoose.Types.ObjectId;
    level: 'user' | 'mod';
    key?: string;
}

export interface IUserKeyDocument extends Document, IUserKeyAttributes { }

export interface IUserKey extends IUserKeyDocument { }

export interface IUserKeyModel extends Model<IUserKey> {
    createForUser(params: { userId: string, lobbyId: string }): string;
    createForMod(params: { lobbyId: string }): string;
}

const UserKeySchema: Schema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        // is only required for level: 'user
        required: false,
    },
    lobbyId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    key: {
        type: String,
    },
    level: {
        type: String,
        enum: ['user', 'mod'],
        required: true,
    },
});

// index them so they can be found or deleted fast
UserKeySchema.index({ userId: 1 });
UserKeySchema.index({ lobbyId: 1 });
UserKeySchema.index({ key: 1 });

UserKeySchema.pre('save', function (next) {
    const userKey = this as IUserKey;
    // userId is required for level: 'user'
    if (userKey.level === 'user' && !userKey.userId) {
        throw new Error(`UserKey of level 'user' cannot be saved without a userId`);
    }
    // generate the key
    userKey.key = randomString({ length: 64 });
    next();
});

UserKeySchema.statics.createForUser = (params: Parameters<IUserKeyModel['createForUser']>[0]) => {
    const { userId, lobbyId } = params;

    return jwt.sign(
        {
            level: 'user',
            userId,
            lobbyId,
        },
        process.env.TOKEN_KEY,
    );
};

UserKeySchema.statics.createForMod = (params: Parameters<IUserKeyModel['createForMod']>[0]) => {
    const { lobbyId } = params;

    return jwt.sign(
        {
            level: 'mod',
            lobbyId,
        },
        process.env.TOKEN_KEY,
    );
};

export const UserKeys = mongoose.model<IUserKey, IUserKeyModel>('UserKeys', UserKeySchema);
