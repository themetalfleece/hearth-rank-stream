import { init as initDb } from './init/mongoose';
import { init as initExpress } from './init/routes';
import { init as initWs } from './init/websockets';

const server = initExpress();
initWs(server);
initDb();
