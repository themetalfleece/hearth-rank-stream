import { Document, Model, Schema } from 'mongoose';

export interface IPlayerAttributes {
    name: string;
    score: {
        rank: number;
        stars: number;
    };
}

export interface IPlayerDocument extends Document, IPlayerAttributes { }

export interface IPlayer extends IPlayerDocument {
    incrementScore(by: number): VoidFunction;
}

export interface IPlayerModel extends Model<IPlayer> { }

export const PlayerSchema: Schema = new Schema({
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

PlayerSchema.methods.incrementScore = function (by: number) {
    const player = this as IPlayer;

    const maxStarsByRank = (rank: number) => {
        if (rank <= 10) { return 5; }
        if (rank <= 15) { return 4; }
        if (rank <= 50) { return 3; }
    };

    if (by !== 1 && by !== -1) {
        throw new Error(`By must be 1 or -1`);
    }

    if (player.score.rank === 0 && by > 0) {
        return;
    }

    const maxStarsCurrentRank = maxStarsByRank(player.score.rank);

    if (player.score.stars === maxStarsCurrentRank && by === 1) {
        player.score.rank--;
        player.score.stars = 1;
    } else if (player.score.stars === 0 && by === -1) {
        player.score.rank++;
        // stars in new rank
        player.score.stars = maxStarsByRank(player.score.rank) - 1;
    } else {
        player.score.stars += by;
    }

    if (player.score.rank === 0) {
        player.score.stars = 0;
    }
};




