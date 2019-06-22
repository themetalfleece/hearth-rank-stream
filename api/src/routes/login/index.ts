import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { UserKeys } from '../../models/UserKeys';

export const router = express.Router();

router.post('/', async (req, res, next) => {
    try {

        try {
            // TODO make reusable
            const token = req.headers.authorization.split(' ')[1];
            const payload: any = await jwt.verify(token, process.env.TOKEN_KEY);
            if (typeof payload === 'object' && payload.userId && payload.lobbyId) {
                return res.json({ ok: true, userId: payload.userId, lobbyId: payload.lobbyId, token });
            }
        } catch (err) {/* just continue */ }

        const { key } = req.body;

        const userKey = await UserKeys.findOne({
            key,
        });

        if (!userKey) {
            throw new Error(`Access key is invalid`);
        }

        const { userId, lobbyId } = userKey;

        const token = jwt.sign(
            {
                userId,
                lobbyId,
            },
            process.env.TOKEN_KEY,
        );

        res.json({
            ok: true,
            token,
            userId,
            lobbyId,
        });
    } catch (err) {
        next(err);
    }
});
