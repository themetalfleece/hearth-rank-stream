import React from 'react';
import { Redirect } from 'react-router-dom';
import { apiAxios } from '../../utils/axios';
import { Button } from 'react-bootstrap';

const LoginPage: React.FC = () => {

    const [connectionInfo, setConnectionInfo] = React.useState({ userId: '', lobbyId: '' });
    const [accessKeyInputValue, setAccessKeyInputValue] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    if (connectionInfo.lobbyId && connectionInfo.userId) {
        return <Redirect to={`/lobbies/${connectionInfo.lobbyId}/users/${connectionInfo.userId}`}></Redirect>
    }

    const login = async () => {
        if (isLoading) { return; }
        setIsLoading(true);
        try {
            const res = await apiAxios.post('/login/',
                {
                    key: accessKeyInputValue,
                },
            );

            if (res.data.ok && res.data.token) {
                setConnectionInfo({ userId: res.data.userId, lobbyId: res.data.lobbyId });
                localStorage.setItem('jwt', res.data.token);
                return;
            }

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
        }
    };

    const jwt = localStorage.getItem(`jwt`);
    if (jwt) {
        login();
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
                login();
            }}
        />
        <Button onClick={login} disabled={isLoading}>Go</Button>
    </>);
};

export default LoginPage;
