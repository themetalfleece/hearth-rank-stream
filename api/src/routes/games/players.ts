import * as express from 'express';
import { Game } from '../../models/Game';
import { Player } from '../../models/Player';

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
router.post('/', (req, res, next) => {
    const { gameId } = req.body;

    const name: Player['name'] = req.body.player.name;
    const score: Player['score'] = req.body.player.score;
    const player = new Player(name, score);

    const game = Game.getById(gameId);
    game.addPlayer(player);

    res.json({ ok: true, player });
});
