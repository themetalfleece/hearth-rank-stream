import * as express from 'express';
import { Game } from '../models/Game';
export const router = express.Router();

/**
 * gets the game of the given id
 */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  res.send(Game.getById(id));
});

/**
 * creates a new game
 */
router.post('/', (req, res, next) => {
  const game = new Game();
  res.json({ id: game.id });
});
