import * as randomString from 'crypto-random-string';
import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

export interface IUserKeyAttributes {
    userId: mongoose.Types.ObjectId;
    lobbyId: mongoose.Types.ObjectId;
    key?: string;
}

export interface IUserKeyDocument extends Document, IUserKeyAttributes { }

export interface IUserKey extends IUserKeyDocument { }

export interface IUserKeyModel extends Model<IUserKey> { }

const UserKeySchema: Schema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    lobbyId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    key: {
        type: String,
    },
});

// index them so they can be found or deleted fast
UserKeySchema.index({ userId: 1 });
UserKeySchema.index({ lobbyId: 1 });
UserKeySchema.index({ key: 1 });

UserKeySchema.pre('save', function (next) {
    const userKey = this as IUserKey;
    userKey.key = randomString({ length: 64 });
    next();
});

export const UserKeys = mongoose.model<IUserKey, IUserKeyModel>('UserKeys', UserKeySchema);
