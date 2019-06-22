export interface UserI {
    _id: string;
    name: string;
    score: {
        rank: number;
        stars: number;
    };
}
