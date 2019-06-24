import * as express from 'express';
import { ws } from '../../init/websockets';
import { Lobbies } from '../../models/Lobbies';
import { IUserAttributes, } from '../../models/Users';

export const router = express.Router({ mergeParams: true });

/**
 * adds a user
 * @apiParam {String} lobbyId - the lobby id
 * @apiParam {Object} user - the user object
 * @apiParam {String} user.name - the user name
 * @apiParam {Object} user.score - the score object
 * @apiParam {Number} user.score.rank - the user's rank
 * @apiParam {Number} user.score.stars - the user's stars
 */
router.post('/', async (req, res, next) => {
    try {
        const { lobbyId } = req.body;

        const user: IUserAttributes = {
            name: req.body.user && req.body.user.name,
            score: req.body.user && req.body.user.score || {
                rank: 4,
                stars: 0,
            },
        };

        const lobby = await Lobbies.findOne({ _id: lobbyId });
        await lobby.addUser(user);

        await lobby.emitLobbyInfo();

        res.json({ ok: true, user });
    } catch (err) {
        next(err);
    }
});
