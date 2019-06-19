import * as express from 'express';
import { ws } from '../../init/websockets';
import { Games } from '../../models/Games';
import { router as playersRoute } from './players';

export const router = express.Router();

/**
 * gets player info
 */
router.get('/:gameId/players/:playerId', async (req, res) => {
  const { playerId, gameId } = req.params;

  if (gameId) {
    const game = await Games.findOne({ _id: gameId });
    const player = game.players.find((player) => player._id.equals(playerId));
    if (!player) {
      throw new Error(`Player not found`);
    }
    return res.json({ ok: true, player });
  } else {
    throw new Error(`No gameId passed`);
  }
});

/**
 * modifies the score
 * @apiParam {Object} playerId - the player id
 * @apiParam {String} gameId - the game id
 * @apiParam {Number} by
 * @apiReturns {Object} response
 * @apiReturns {Boolean} response.ok
 * @apiReturns {Object} response.player
 */
router.put('/:gameId/players/:playerId', async (req, res, next) => {
  const { by } = req.body;
  const { playerId, gameId } = req.params;

  const game = await Games.findOne({ _id: gameId });
  const player = await game.incrementPlayerScore(playerId, by);

  ws.io.to(gameId).emit('game-info', { game });

  res.json({ ok: true, player });
});

/**
 * removes the player from the game
 * @apiParam {Object} playerId - the player id
 * @apiParam {String} gameId - the game id
 * @apiReturns {Boolean} response.ok
 */
router.delete('/:gameId/players/:playerId', async (req, res, next) => {
  const { playerId, gameId } = req.params;

  const game = await Games.findOne({ _id: gameId });
  game.removePlayer(playerId);

  ws.io.to(gameId).emit('game-info', { game });

  res.json({ ok: true });
});


router.use('/players', playersRoute);

/**
 * gets the game of the given id
 * @apiParam {String} id - the game id
 */
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  res.send({
    ok: true,
    game: await Games.findOne({ _id: id }),
  });
});

/**
 * creates a new game
 * @apiParam {String} id - the game id
 */
router.post('/', async (req, res, next) => {
  const game = await Games.create({});
  res.json({ ok: true, id: game._id });
});
