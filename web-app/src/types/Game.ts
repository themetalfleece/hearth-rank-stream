import { PlayerI } from "./Player";

export interface GameI {
    _id: string;
    players: PlayerI[];
}