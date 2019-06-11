import * as express from 'express';
import { Game } from '../models/Game';
import { Player } from '../models/Player';

export const router = express.Router();

/**
 * gets the game of the given id
 * @apiParam {String} id - the game id
 */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  res.send(Game.getById(id));
});

/**
 * creates a new game
 * @apiParam {String} id - the game id
 */
router.post('/', (req, res, next) => {
  const game = new Game();
  res.json({ id: game.id });
});

/**
 * creates a new game
 * @apiParam {String} gameId - the game id
 * @apiParam {Object} player - the player object
 * @apiParam {String} player.name - the player name
 * @apiParam {Object} player.score - the score object
 * @apiParam {Number} player.score.rank - the player's rank
 * @apiParam {Number} player.score.stars - the player's stars
 */
router.post('/players/', (req, res, next) => {
  const { gameId } = req.body;

  const name: Player['name'] = req.body.player.name;
  const score: Player['score'] = req.body.player.score;
  const player = new Player(name, score);

  const game = Game.getById(gameId);
  game.addPlayer(player);

  res.json({ player });
});

/**
 * creates a new game
 * @apiParam {String} gameId - the game id
 * @apiParam {Object} playerId - the player id
 * @apiParam {Number} by
 */
router.post('/players/incrementScore', (req, res, next) => {
  const { gameId, playerId, by } = req.body;

  const game = Game.getById(gameId);
  const player = game.incrementPlayerScore(playerId, by);

  res.json({ player });
});
