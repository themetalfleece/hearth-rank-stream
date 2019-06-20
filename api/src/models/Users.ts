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
    },
    score: {
        rank: {
            type: Number,
            required: true,
        },
        // TODO
        //         if (stars < 0 || stars > 5) {
        //             throw new Error(`Invalid stars amount`);
        //         }
        //         if (rank < 0 || rank > 50) {
        //             throw new Error(`Invalid rank amount`);
        //         }
        stars: {
            type: Number,
            required: true,
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




