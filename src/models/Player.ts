import * as uuid from 'uuid';

export class Player {
    public name: string;
    public id: string;
    public score: {
        rank: number;
        stars: number;
    };

    constructor(name: Player['name'], score?: Player['score']) {
        this.name = name;
        this.id = uuid.v4();
        this.score = score || {
            rank: 4,
            stars: 0,
        };

        this.validate();
    }

    public incrementScore(by: number) {
        const maxStarsByRank = (rank: number) => {
            if (rank <= 10) { return 5; }
            if (rank <= 15) { return 4; }
            if (rank <= 50) { return 3; }
        };

        if (by !== 1 && by !== -1) {
            throw new Error(`By must be 1 or -1`);
        }

        if (this.score.rank === 0) {
            return;
        }

        const maxStarsCurrentRank = maxStarsByRank(this.score.rank);

        if (this.score.stars === maxStarsCurrentRank && by === 1) {
            this.score.rank--;
            this.score.stars = 1;
        } else if (this.score.stars === 0 && by === -1) {
            this.score.rank++;
            // stars in new rank
            this.score.stars = maxStarsByRank(this.score.rank) - 1;
        } else {
            this.score.stars += by;
        }

        if (this.score.rank === 0) {
            this.score.stars = 0;
        }

        this.validate();
    }

    private validate() {
        if (!this.score) {
            throw new Error(`score not specified`);
        }

        if (!this.name) {
            throw new Error(`Name not specified`);
        }

        const { rank, stars } = this.score;
        if (!Number.isInteger(rank) || !(Number.isInteger(stars))) {
            throw new Error(`rank or stars is not an integer`);
        }
        if (stars < 0 || stars > 5) {
            throw new Error(`Invalid stars amount`);
        }
        if (rank < 0 || rank > 50) {
            throw new Error(`Invalid rank amount`);
        }
    }
}
