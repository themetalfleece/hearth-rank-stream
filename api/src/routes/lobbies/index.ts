import * as express from 'express';
import { ws } from '../../init/websockets';
import { Lobbies } from '../../models/Lobbies';
import { router as playersRoute } from './players';

export const router = express.Router();

/**
 * gets player info
 */
router.get('/:lobbyId/players/:playerId', async (req, res) => {
  const { playerId, lobbyId } = req.params;

  if (lobbyId) {
    const lobby = await Lobbies.findOne({ _id: lobbyId });
    const player = lobby.players.find((player) => player._id.equals(playerId));
    if (!player) {
      throw new Error(`Player not found`);
    }
    return res.json({ ok: true, player });
  } else {
    throw new Error(`No lobbyId passed`);
  }
});

/**
 * modifies the score
 * @apiParam {Object} playerId - the player id
 * @apiParam {String} lobbyId - the lobby id
 * @apiParam {Number} by
 * @apiReturns {Object} response
 * @apiReturns {Boolean} response.ok
 * @apiReturns {Object} response.player
 */
router.put('/:lobbyId/players/:playerId', async (req, res, next) => {
  const { by } = req.body;
  const { playerId, lobbyId } = req.params;

  const lobby = await Lobbies.findOne({ _id: lobbyId });
  const player = await lobby.incrementPlayerScore(playerId, by);

  ws.io.to(lobbyId).emit('lobby-info', { lobby });

  res.json({ ok: true, player });
});

/**
 * removes the player from the lobby
 * @apiParam {Object} playerId - the player id
 * @apiParam {String} lobbyId - the lobby id
 * @apiReturns {Boolean} response.ok
 */
router.delete('/:lobbyId/players/:playerId', async (req, res, next) => {
  const { playerId, lobbyId } = req.params;

  const lobby = await Lobbies.findOne({ _id: lobbyId });
  lobby.removePlayer(playerId);

  ws.io.to(lobbyId).emit('lobby-info', { lobby });

  res.json({ ok: true });
});


router.use('/players', playersRoute);

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
