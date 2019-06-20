import React from 'react';
import { Redirect } from 'react-router-dom';
import { apiAxios } from '../../utils/axios';

const ModActions: React.FC = () => {
    const [lobbyId, setLobbyId] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    if (lobbyId) {
        return <Redirect to={`/mod/${lobbyId}`} />
    }

    const onCreateLobbyClicked = async () => {
        setIsLoading(true);
        try {
            const res = await apiAxios.post('/lobbies/');

            if (res.data && res.data.id) {
                setLobbyId(res.data.id);
                return;
            }

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button
                disabled={isLoading}
                onClick={onCreateLobbyClicked}
            >
                Create Lobby
            </button>
        </div>
    )
}

export default ModActions;
