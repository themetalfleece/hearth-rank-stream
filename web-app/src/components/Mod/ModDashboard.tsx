import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { apiAxios } from '../../utils/axios';
import PlayersTable from '../Player/PlayersTable';
import { LobbyI } from '../../types/Lobby';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button } from 'react-bootstrap';

const NewPlayerInput: React.FC<{
    lobbyId: string;
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
                await apiAxios.post('/lobbies/players', {
                    lobbyId: props.lobbyId,
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

    const lobbyId = props.match.params.id;

    const [lobby, setLobby] = React.useState<LobbyI>({
        _id: '',
        players: [],
    });

    // fetch the lobby data and set them
    const getLobby = React.useCallback(async () => {
        const { data } = await apiAxios.get(`/lobbies/${lobbyId}`);
        setLobby(data.lobby);
    }, [lobbyId]);

    // on loading, get lobby data
    React.useEffect(() => {
        getLobby();
    }, [getLobby]);

    let lobbyElement: JSX.Element = <div> Loading </div>;
    if (lobby) {
        let playerTableElement: JSX.Element = <></>;
        let copyToClipboardElement: JSX.Element = <></>;
        if (lobby._id) {
            playerTableElement = <PlayersTable
                lobbyId={lobby._id}
                onKick={async (playerId) => {
                    await apiAxios.delete(`/lobbies/${lobbyId}/players/${playerId}`);
                    getLobby();
                }}
            />;
            copyToClipboardElement = <CopyToClipboard text={`${window.location.host}/lobbies/${lobbyId}?forStream=true&maxColumns=10`}>
                <Button variant="warning">Copy OBS link</Button>
            </CopyToClipboard>;
        }
        lobbyElement = <div>
            {copyToClipboardElement}
            <br />
            {playerTableElement}
            <br />
            Add Player
                <NewPlayerInput
                lobbyId={lobbyId}
                onSuccess={getLobby}
            />
        </div>
    }

    return (
        <>
            {lobbyElement}
        </>
    )
}

export default withRouter(ModDashboard);
