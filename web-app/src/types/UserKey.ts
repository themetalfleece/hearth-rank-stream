export interface UserKeyI {
    userId: string;
    lobbyId: string;
    level: 'user' | 'mod';
    key: string;
}
