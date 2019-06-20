import { Server } from 'http';
import * as socket from 'socket.io';
import { Lobbies } from '../models/Lobbies';

export const ws: {
    io: socket.Server;
} = {
    io: null,
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
            socket.on('join-lobby', async (data) => {
                if (data && data.lobbyId) {
                    // the the room by lobbyId
                    socket.join(data && data.lobbyId);

                    // emit the current lobby info
                    socket.emit('lobby-info', {
                        lobby: await Lobbies.findOne({ _id: data.lobbyId }),
                    });
                }
            });
        });
    } catch (err) {
        // fail silently
    }
};
