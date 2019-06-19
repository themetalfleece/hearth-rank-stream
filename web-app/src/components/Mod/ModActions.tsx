import React from 'react';
import { Redirect } from 'react-router-dom';
import { apiAxios } from '../../utils/axios';

const ModActions: React.FC = () => {
    const [gameId, setGameId] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    if (gameId) {
        return <Redirect to={`/mod/${gameId}`} />
    }

    const onCreateGameClicked = async () => {
        setIsLoading(true);
        try {
            const res = await apiAxios.post('/games/');

            if (res.data && res.data._id) {
                setGameId(res.data._id);
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
                onClick={onCreateGameClicked}
            >
                Create Game
            </button>
        </div>
    )
}

export default ModActions;
