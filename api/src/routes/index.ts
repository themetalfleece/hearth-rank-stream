import { Router, static as staticServe } from 'express';
import * as path from 'path';
export const router = Router();

const reactDist = path.resolve(__dirname, '..', '..', '..', 'web-app', 'build');
const reactIndex = path.resolve(reactDist, 'index.html');

// it finds anything that exists, serve it
router.get(['/', '/*'], staticServe(reactDist));
// else, serve the index
router.get(['/', '/*'], staticServe(reactIndex));
