export const setJWT = (jwt: string) => localStorage.setItem('jwt', jwt);
export const getJWT = () => localStorage.getItem('jwt');
export const removeJWT = () => localStorage.removeItem('jwt');
