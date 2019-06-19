import { Server } from 'http';
import * as socket from 'socket.io';
import { Games } from '../models/Games';

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
            socket.on('join-game', async (data) => {
                if (data && data.gameId) {
                    // the the room by gameId
                    socket.join(data && data.gameId);

                    // emit the current game info
                    socket.emit('game-info', {
                        game: await Games.findOne({ _id: data.gameId }),
                    });
                }
            });
        });
    } catch (err) {
        // fail silently
    }
};
