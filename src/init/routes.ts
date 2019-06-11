import * as cookieParser from 'cookie-parser';
import { Express } from 'express';
import * as express from 'express';
import * as http from 'http';
import * as logger from 'morgan';
import * as path from 'path';

import { router as gamesRouter } from '../routes/games';
import { router as indexRouter } from '../routes/index';

export const useRoutes = (app: Express) => {
    app.use('/', indexRouter);
    app.use('/games', gamesRouter);
};

export const init = () => {

    const app = express();

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    // use the routes
    useRoutes(app);

    // error handler
    app.use((err, req, res, next) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.json({ ok: false });
    });

    /**
     * Normalize a port into a number, string, or false.
     */
    const normalizePort = (val) => {
        const port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    };

    /**
     * Get port from environment and store in Express.
     */
    const port = normalizePort(process.env.PORT || '3000');
    app.set('port', port);

    /**
     * Create HTTP server.
     */

    const server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);

    /**
     * Event listener for HTTP server "error" event.
     */
    server.on('error', (error: Error & { syscall?: string; code?: string }) => {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    });

    /**
     * Event listener for HTTP server "listening" event.
     */
    server.on('listening', () => {
        const addr = server.address();
        const bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
    });
};
