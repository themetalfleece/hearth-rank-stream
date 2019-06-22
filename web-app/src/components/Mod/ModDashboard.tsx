import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { apiAxios } from '../../utils/axios';
import UserTable from '../User/UserTable';
import { LobbyI } from '../../types/Lobby';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Modal } from 'react-bootstrap';
import { UserI } from '../../types/User';

// the component for adding a new user to the lobby
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

    // lobby object which will be fetched from the server
    const [lobby, setLobby] = React.useState<LobbyI | undefined>(undefined);
    // in case a user is about to be kicked and confirmation is pending
    const [userToKick, setUserToKick] = React.useState<UserI | undefined>();

    // fetch the lobby data and set them
    const getLobby = React.useCallback(async () => {
        const { data } = await apiAxios.get(`/lobbies/${lobbyId}`);
        setLobby(data.lobby);
    }, [lobbyId]);

    // on loading, get lobby data
    React.useEffect(() => {
        getLobby();
    }, [getLobby]);

    // the element which corresponds to the lobby
    let lobbyElement: JSX.Element = <div> Loading </div>;
    if (lobby && lobby._id) {
        // lobby name
        const lobbyNameElement = <span> Welcome to {lobby.name} </span>;

        // the table of users
        const userTableElement =
            <UserTable
                lobbyId={lobby._id}
                onKick={(user) => { setUserToKick(user) }}
            />;

        // the element for copying links to the clipboard
        const copyToClipboardElement =
            <CopyToClipboard text={`${window.location.host}/lobbies/${lobbyId}?forStream=true&maxColumns=10`}>
                <Button variant="warning">Copy OBS link</Button>
            </CopyToClipboard>;

        // the input for adding a new user
        const addUserElement =
            <>
                Add User
                <NewUserInput
                    lobbyId={lobbyId}
                    onSuccess={getLobby}
                />
            </>;

        // the confirmation element which appears if a player is about to be kicked
        let toKickConfirmElement = <></>;
        if (userToKick) {
            toKickConfirmElement =
                <Modal.Dialog>
                    <Modal.Body>
                        <p>Really kick {userToKick.name}?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="danger"
                            onClick={async () => {
                                await apiAxios.delete(`/lobbies/${lobbyId}/users/${userToKick._id}`);
                                setUserToKick(undefined);
                                getLobby();
                            }}
                        >
                            Kick
                            </Button>
                        <Button
                            variant="primary"
                            onClick={() => { setUserToKick(undefined); }}
                        >
                            Don't kick
                            </Button>
                    </Modal.Footer>
                </Modal.Dialog>;
        }

        lobbyElement = <div>
            {toKickConfirmElement}
            <br />
            {lobbyNameElement}
            <br />
            {copyToClipboardElement}
            <br />
            {userTableElement}
            <br />
            {addUserElement}
        </div>
    }

    return (
        <>
            {lobbyElement}
        </>
    )
}

export default withRouter(ModDashboard);
