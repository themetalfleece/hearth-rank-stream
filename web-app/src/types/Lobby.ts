import { UserI } from "./User";

export interface LobbyI {
    _id: string;
    name: string;
    users: UserI[];
}