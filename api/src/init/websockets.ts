import { Server } from 'http';
import * as socket from 'socket.io';
import { Lobbies } from '../models/Lobbies';

export const ws: {
    io: socket.Server;
    getRoomName: (params: { lobbyId: string; level: 'user' | 'mod' }) => string;
} = {
    io: null,
    getRoomName: (params) => params.level + ' ' + params.lobbyId,
};

export const init = (server?: Server) => {
    if (ws.io) {
        return ws;
    }
    if (!server) {
        throw new Error(`Cannot init websockets without the server param`);
    }
    ws.io = socket(server);
    try {
        ws.io.on('connection', (socket) => {
            // TODO set it by the jwt
            const level: 'user' | 'mod' = 'mod';
            socket.on('join-lobby', async (data) => {
                if (data && data.lobbyId) {
                    // the the room by lobbyId, separated mod-user via authentication
                    if (data && data.lobbyId) {
                        const { lobbyId } = data;
                        const roomName = ws.getRoomName({ lobbyId, level });
                        socket.join(roomName);
                    }

                    const lobby = await Lobbies.findOne({ _id: data.lobbyId });
                    // emit the current lobby info
                    await lobby.emitLobbyInfo();
                }
            });
        });
    } catch (err) {
        // fail silently
    }
};
