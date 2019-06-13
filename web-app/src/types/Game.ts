import { PlayerI } from "./Player";

export interface GameI {
    id: string;
    players: PlayerI[];
}