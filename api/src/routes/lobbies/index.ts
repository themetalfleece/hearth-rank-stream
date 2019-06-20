import * as express from 'express';
import { ws } from '../../init/websockets';
import { Lobbies } from '../../models/Lobbies';
import { router as usersRoute } from './users';

export const router = express.Router();

/**
 * gets user info
 */
router.get('/:lobbyId/users/:userId', async (req, res) => {
  const { userId, lobbyId } = req.params;

  if (lobbyId) {
    const lobby = await Lobbies.findOne({ _id: lobbyId });
    const user = lobby.users.find((user) => user._id.equals(userId));
    if (!user) {
      throw new Error(`User not found`);
    }
    return res.json({ ok: true, user });
  } else {
    throw new Error(`No lobbyId passed`);
  }
});

/**
 * modifies the score
 * @apiParam {Object} userId - the user id
 * @apiParam {String} lobbyId - the lobby id
 * @apiParam {Number} by
 * @apiReturns {Object} response
 * @apiReturns {Boolean} response.ok
 * @apiReturns {Object} response.user
 */
router.put('/:lobbyId/users/:userId', async (req, res, next) => {
  const { by } = req.body;
  const { userId, lobbyId } = req.params;

  const lobby = await Lobbies.findOne({ _id: lobbyId });
  const user = await lobby.incrementUserScore(userId, by);

  ws.io.to(lobbyId).emit('lobby-info', { lobby });

  res.json({ ok: true, user });
});

/**
 * removes the user from the lobby
 * @apiParam {Object} userId - the user id
 * @apiParam {String} lobbyId - the lobby id
 * @apiReturns {Boolean} response.ok
 */
router.delete('/:lobbyId/users/:userId', async (req, res, next) => {
  const { userId, lobbyId } = req.params;

  const lobby = await Lobbies.findOne({ _id: lobbyId });
  lobby.removeUser(userId);

  ws.io.to(lobbyId).emit('lobby-info', { lobby });

  res.json({ ok: true });
});


router.use('/users', usersRoute);

/**
 * gets the lobby of the given id
 * @apiParam {String} id - the lobby id
 */
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  res.send({
    ok: true,
    lobby: await Lobbies.findOne({ _id: id }),
  });
});

/**
 * creates a new lobby
 * @apiParam {String} id - the lobby id
 */
router.post('/', async (req, res, next) => {
  const lobby = await Lobbies.create({});
  res.json({ ok: true, id: lobby._id });
});
