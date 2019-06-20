import { UserI } from "./User";

export interface LobbyI {
    _id: string;
    users: UserI[];
}