import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { apiAxios } from '../../utils/axios';
import PlayersTable from '../Player/PlayersTable';
import { GameI } from '../../types/Game';
import CopyToClipboard from 'react-copy-to-clipboard';

const NewPlayerInput: React.FC<{
    gameId: string;
    onSuccess?: VoidFunction;
}> = (props) => {
    const [newPlayerName, setNewPlayerName] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    return <input
        value={newPlayerName}
        disabled={isLoading}
        autoFocus={true}
        onChange={(event) => {
            setNewPlayerName(event.target.value);
        }}
        onKeyDown={async (event) => {
            if (event.key !== 'Enter') { return; }

            setIsLoading(true);
            try {
                await apiAxios.post('/games/players', {
                    gameId: props.gameId,
                    player: {
                        name: newPlayerName,
                    }
                });

                setNewPlayerName('');
                setIsLoading(false);
                if (props.onSuccess) {
                    props.onSuccess();
                }
            } catch (err) {
                setIsLoading(false);
            }
        }}
    />
}

const ModDashboard: React.FC<
    RouteComponentProps<{ id: string }>
> = (props) => {

    const gameId = props.match.params.id;

    const [game, setGame] = React.useState<GameI>({
        _id: '',
        players: [],
    });

    // fetch the game data and set them
    const getGame = React.useCallback(async () => {
        const { data } = await apiAxios.get(`/games/${gameId}`);
        setGame(data.game);
    }, [gameId]);

    // on loading, get game data
    React.useEffect(() => {
        getGame();
    }, [getGame]);

    let gameElement: JSX.Element = <div> Loading </div>;
    if (game) {
        let playerTableElement: JSX.Element = <></>;
        let copyToClipboardElement: JSX.Element = <></>;
        if (game._id) {
            playerTableElement = <PlayersTable
                gameId={game._id}
                onKick={async (playerId) => {
                    await apiAxios.delete(`/games/${gameId}/players/${playerId}`);
                    getGame();
                }}
            />;
            copyToClipboardElement = <CopyToClipboard text={`${window.location.host}/games/${gameId}?forStream=true&maxColumns=10`}>
                <button>Copy OBS link</button>
            </CopyToClipboard>;
        }
        gameElement = <div>
            {copyToClipboardElement}
            <br />
            {playerTableElement}
        </div>
    }

    return (
        <>
            <div>
                {gameElement}
            </div>
            <div>
                Add Player
                <NewPlayerInput
                    gameId={gameId}
                    onSuccess={getGame}
                />
            </div>
        </>
    )
}

export default withRouter(ModDashboard);
