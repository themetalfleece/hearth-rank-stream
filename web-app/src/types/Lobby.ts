import { PlayerI } from "./Player";

export interface LobbyI {
    _id: string;
    players: PlayerI[];
}