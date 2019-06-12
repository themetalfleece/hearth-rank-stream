import * as express from 'express';
import { Game } from '../../models/Game';
import { router as playersRoute } from './players';

export const router = express.Router();

router.get('/:gameId/players/:playerId', (req, res) => {
  const { playerId, gameId } = req.params;

  if (gameId) {
    const game = Game.getById(gameId);
    const player = game.players.find((player) => player.id === playerId);
    if (!player) {
      throw new Error(`Player not found`);
    }
    return res.json({ ok: true, player });
  } else {
    throw new Error(`No gameId passed`);
  }
});

router.use('/players', playersRoute);

/**
 * gets the game of the given id
 * @apiParam {String} id - the game id
 */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  res.send({
    ok: true,
    game: Game.getById(id),
  });
});

/**
 * creates a new game
 * @apiParam {String} id - the game id
 */
router.post('/', (req, res, next) => {
  const game = new Game();
  res.json({ ok: true, id: game.id });
});
