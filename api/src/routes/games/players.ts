import * as express from 'express';
import { ws } from '../../init/websockets';
import { Games } from '../../models/Games';
import { IPlayerAttributes, } from '../../models/Players';

export const router = express.Router({ mergeParams: true });

/**
 * adds a player
 * @apiParam {String} gameId - the game id
 * @apiParam {Object} player - the player object
 * @apiParam {String} player.name - the player name
 * @apiParam {Object} player.score - the score object
 * @apiParam {Number} player.score.rank - the player's rank
 * @apiParam {Number} player.score.stars - the player's stars
 */
router.post('/', async (req, res, next) => {
    const { gameId } = req.body;

    const player: IPlayerAttributes = {
        name: req.body.player && req.body.player.name,
        score: req.body.player && req.body.player.score || {
            rank: 4,
            stars: 0,
        },
    };

    const game = await Games.findOne({ _id: gameId });
    game.addPlayer(player);

    ws.io.to(gameId).emit('game-info', { game });

    res.json({ ok: true, player });
});
