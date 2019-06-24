import React from 'react';
import { Redirect } from 'react-router-dom';
import { apiAxios } from '../../utils/axios';
import { Button } from 'react-bootstrap';
import { setJWT, getJWT } from '../../utils/authentication';

const AuthenticatePage: React.FC = () => {

    // the user and lobby id which are gonna be given by the server, while logging in
    const [connectionInfo, setConnectionInfo] = React.useState({ userId: '', lobbyId: '' });
    const [accessKeyInputValue, setAccessKeyInputValue] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    // if the connection info is set, redirect to the user page
    if (connectionInfo.lobbyId && connectionInfo.userId) {
        return <Redirect to={`/lobbies/${connectionInfo.lobbyId}/users/${connectionInfo.userId}`}></Redirect>
    }

    // makes the authenticate request and saves the returned jwt into localStorage
    const authenticate = async () => {
        if (isLoading) { return; }

        setIsLoading(true);

        try {
            const res = await apiAxios.post('/authenticate/',
                {
                    key: accessKeyInputValue,
                },
            );

            if (res.data.ok && res.data.token) {
                // on success, save the token at localStorage
                setConnectionInfo({ userId: res.data.userId, lobbyId: res.data.lobbyId });
                setJWT(res.data.token);
                return;
            }

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
        }
    };

    // if a jwt is already in the localStorage, try to authenticate with it
    const jwt = getJWT();
    if (jwt) {
        authenticate();
    }

    return (<>
        <input
            disabled={isLoading}
            placeholder='Access key'
            onChange={(event) => {
                setAccessKeyInputValue(event.target.value);
            }}
            onKeyDown={(event) => {
                if (event.key !== 'Enter') { return; }
                authenticate();
            }}
        />
        <Button onClick={authenticate} disabled={isLoading}>Go</Button>
    </>);
};

export default AuthenticatePage;
