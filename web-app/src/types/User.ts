export interface UserI {
    name: string;
    _id: string;
    score: {
        rank: number;
        stars: number;
    };
}
