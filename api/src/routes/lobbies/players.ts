import * as express from 'express';
import { ws } from '../../init/websockets';
import { Lobbies } from '../../models/Lobbies';
import { IPlayerAttributes, } from '../../models/Players';

export const router = express.Router({ mergeParams: true });

/**
 * adds a player
 * @apiParam {String} lobbyId - the lobby id
 * @apiParam {Object} player - the player object
 * @apiParam {String} player.name - the player name
 * @apiParam {Object} player.score - the score object
 * @apiParam {Number} player.score.rank - the player's rank
 * @apiParam {Number} player.score.stars - the player's stars
 */
router.post('/', async (req, res, next) => {
    const { lobbyId } = req.body;

    const player: IPlayerAttributes = {
        name: req.body.player && req.body.player.name,
        score: req.body.player && req.body.player.score || {
            rank: 4,
            stars: 0,
        },
    };

    const lobby = await Lobbies.findOne({ _id: lobbyId });
    lobby.addPlayer(player);

    ws.io.to(lobbyId).emit('lobby-info', { lobby });

    res.json({ ok: true, player });
});
