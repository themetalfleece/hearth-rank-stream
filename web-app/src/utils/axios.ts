import axios from 'axios';

export const apiAxios = axios.create({
    baseURL: '//localhost:3000/api/',
    timeout: 3000,
    validateStatus: (status) => {
        return status >= 200 && status < 300;
    },
});
