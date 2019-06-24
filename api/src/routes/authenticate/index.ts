import * as express from 'express';
import { UserKeys } from '../../models/UserKeys';

export const router = express.Router();

router.post('/', async (req, res, next) => {
    try {

        // try {
        //     // TODO make reusable, also return level
        //     const token = req.headers.authorization.split(' ')[1];
        //     const payload: any = await jwt.verify(token, process.env.TOKEN_KEY);
        //     if (typeof payload === 'object' && payload.userId && payload.lobbyId) {
        //         return res.json({ ok: true, userId: payload.userId, lobbyId: payload.lobbyId, token });
        //     }
        // } catch (err) {/* just continue */ }

        const { key } = req.body;

        const userKey = await UserKeys.findOne({
            key,
        });

        if (!userKey) {
            throw new Error(`Access key is invalid`);
        }

        if (userKey.level === 'user') {
            const { userId, lobbyId } = userKey;

            const token = UserKeys.createForUser({
                userId: userId.toHexString(),
                lobbyId: lobbyId.toHexString(),
            });

            return res.json({
                ok: true,
                level: userKey.level,
                token,
                userId,
                lobbyId,
            });
        } else if (userKey.level === 'mod') {
            const { lobbyId } = userKey;

            const token = UserKeys.createForMod({
                lobbyId: lobbyId.toHexString(),
            });

            return res.json({
                ok: true,
                level: userKey.level,
                token,
                lobbyId,
            });
        }
    } catch (err) {
        next(err);
    }
});
