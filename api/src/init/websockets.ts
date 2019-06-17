import { Server } from 'http';
import * as ws from 'socket.io';
import { Game } from '../models/Game';

let io: ws.Server;

export const init = (server?: Server) => {
    if (io) {
        return io;
    }
    if (!server) {
        throw new Error(`Cannot init websockets without the server param`);
    }
    io = ws(server);
    try {
        io.on('connection', (socket) => {
            socket.on('join-game', (data) => {
                if (data && data.gameId) {
                    // the the room by gameId
                    socket.join(data && data.gameId);

                    // emit the current game info
                    socket.emit('game-info', {
                        game: Game.getById(data.gameId),
                    });
                }
            });
        });
    } catch (err) {
        // fail silently
    }
};
