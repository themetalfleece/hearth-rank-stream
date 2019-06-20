import openSocketIo from 'socket.io-client';

export const openSocket = () => {
    return openSocketIo(process.env.REACT_APP_WEBSOCKETS_URL || 'http://localhost:3000');
}