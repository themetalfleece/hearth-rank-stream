import axios from 'axios';
import { getJWT } from './authentication';

export const apiAxios = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || '//localhost:3000/api/',
    timeout: 3000,
    validateStatus: (status) => {
        return status >= 200 && status < 300;
    },
    headers: {
        // include the stored json web token
        Authorization: 'bearer ' + getJWT(),
    }
});
