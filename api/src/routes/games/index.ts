import * as express from 'express';
import { Game } from '../../models/Game';
import { router as playersRoute } from './players';

export const router = express.Router();

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
