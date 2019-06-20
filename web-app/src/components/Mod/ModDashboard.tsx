import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { apiAxios } from '../../utils/axios';
import UserTable from '../User/UserTable';
import { LobbyI } from '../../types/Lobby';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Modal } from 'react-bootstrap';
import { UserI } from '../../types/User';

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
        name: '',
        users: [],
    });
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

    let lobbyElement: JSX.Element = <div> Loading </div>;
    if (lobby) {
        let userTableElement = <></>;
        let copyToClipboardElement = <></>;
        let addUserElement = <></>;
        let lobbyNameElement = <></>;
        let toKickConfirmElement = <></>;

        if (lobby._id) {
            lobbyNameElement = <span> Welcome to {lobby.name} </span>;

            userTableElement = <UserTable
                lobbyId={lobby._id}
                onKick={(user) => { setUserToKick(user) }}
            />;

            copyToClipboardElement = <CopyToClipboard text={`${window.location.host}/lobbies/${lobbyId}?forStream=true&maxColumns=10`}>
                <Button variant="warning">Copy OBS link</Button>
            </CopyToClipboard>;

            addUserElement = <>
                Add User
                <NewUserInput
                    lobbyId={lobbyId}
                    onSuccess={getLobby}
                />
            </>;

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
