import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { apiAxios } from '../../utils/axios';
import UserTable from '../User/UserTable';
import { LobbyI } from '../../types/Lobby';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button } from 'react-bootstrap';

const NewUserInput: React.FC<{
    lobbyId: string;
    onSuccess?: VoidFunction;
}> = (props) => {
    const [newUserName, setNewUserName] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    return <input
        value={newUserName}
        disabled={isLoading}
        autoFocus={true}
        onChange={(event) => {
            setNewUserName(event.target.value);
        }}
        onKeyDown={async (event) => {
            if (event.key !== 'Enter') { return; }

            setIsLoading(true);
            try {
                await apiAxios.post('/lobbies/users', {
                    lobbyId: props.lobbyId,
                    user: {
                        name: newUserName,
                    }
                });

                setNewUserName('');
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
        users: [],
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
        let userTableElement: JSX.Element = <></>;
        let copyToClipboardElement: JSX.Element = <></>;
        if (lobby._id) {
            userTableElement = <UserTable
                lobbyId={lobby._id}
                onKick={async (userId) => {
                    await apiAxios.delete(`/lobbies/${lobbyId}/users/${userId}`);
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
            {userTableElement}
            <br />
            Add User
                <NewUserInput
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
