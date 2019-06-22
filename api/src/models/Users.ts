import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

export interface IUserAttributes {
    name: string;
    score: {
        rank: number;
        stars: number;
    };
}

export interface IUserDocument extends Document, IUserAttributes { }

export interface IUser extends IUserDocument {
    incrementScore(by: number): VoidFunction;
}

export interface IUserModel extends Model<IUser> { }

export const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    score: {
        type: new Schema({
            rank: {
                type: Number,
                required: true,
            },
            stars: {
                type: Number,
                required: true,
            },
        }),
        validate: (score: IUserAttributes['score']) => {
            return (score.stars >= 0 && score.stars <= 5 && score.rank >= 0 && score.rank <= 50);
        },
    },
});

UserSchema.methods.incrementScore = function (by: number) {
    const user = this as IUser;

    const maxStarsByRank = (rank: number) => {
        if (rank <= 10) { return 5; }
        if (rank <= 15) { return 4; }
        if (rank <= 50) { return 3; }
    };

    if (by !== 1 && by !== -1) {
        throw new Error(`By must be 1 or -1`);
    }

    if (user.score.rank === 0 && by > 0) {
        return;
    }

    const maxStarsCurrentRank = maxStarsByRank(user.score.rank);

    if (user.score.stars === maxStarsCurrentRank && by === 1) {
        user.score.rank--;
        user.score.stars = 1;
    } else if (user.score.stars === 0 && by === -1) {
        user.score.rank++;
        // stars in new rank
        user.score.stars = maxStarsByRank(user.score.rank) - 1;
    } else {
        user.score.stars += by;
    }

    if (user.score.rank === 0) {
        user.score.stars = 0;
    }
};

export const Users = mongoose.model<IUser, IUserModel>('Users', UserSchema);
