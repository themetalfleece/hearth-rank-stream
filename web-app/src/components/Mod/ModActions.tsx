import React from 'react';
import { Redirect } from 'react-router-dom';
import { apiAxios } from '../../utils/axios';
import { Button } from 'react-bootstrap';

const ModActions: React.FC = () => {
    const [lobbyId, setLobbyId] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [lobbyNameInputValue, setLobbyNameInputValue] = React.useState('');

    if (lobbyId) {
        return <Redirect to={`/mod/${lobbyId}`} />
    }

    const createLobby = async () => {
        setIsLoading(true);
        try {
            const res = await apiAxios.post('/lobbies/', {
                name: lobbyNameInputValue,
            });

            if (res.data && res.data.id) {
                setLobbyId(res.data.id);
                return;
            }

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
        }
    };

    const createLobbyElement: JSX.Element = <div>
        <input
            placeholder="Lobby name"
            onChange={(event) => {
                setLobbyNameInputValue(event.target.value);
            }}
            onKeyDown={(event) => {
                if (event.key !== 'Enter') { return; }
                createLobby();
            }}
        >
        </input>
        <Button
            disabled={isLoading}
            onClick={createLobby}
        >
            Create Lobby
        </Button>
    </div>

    return (
        <>
            {createLobbyElement}
        </>
    );
}

export default ModActions;
