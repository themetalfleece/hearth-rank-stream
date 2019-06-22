import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { apiAxios } from '../../utils/axios';
import UserScore from './UserScore';
import { UserI } from '../../types/User';
import { Button, ButtonGroup, Container, Row, Modal, Col } from 'react-bootstrap';
import { LobbyI } from '../../types/Lobby';

// a button which is used for increasing or decreasing the player score
const ScoreModifyButton: React.FC<{
    disabled: boolean;
    userId: string;
    lobbyId: string;
    direction: 'positive' | 'negative';
    onSuccess: (user: UserI) => void;
}> = (props) => {
    const onClick: VoidFunction = async () => {
        const res = await apiAxios.put(`/lobbies/${props.lobbyId}/users/${props.userId}`, {
            by: props.direction === 'positive' ? 1 : -1,
        });
        props.onSuccess(res.data.user);
    };

    return (
        <Button variant="dark" size="lg" disabled={props.disabled} onClick={onClick}>{props.direction === 'positive' ? '+' : '-'}</Button>
    );
};

const User: React.FC<
    RouteComponentProps<{
        lobbyId: string;
        userId: string;
    }>
> = (props) => {
    const lobbyId = props.match.params.lobbyId;
    const userId = props.match.params.userId;

    // the user which will be fetched from the server
    const [user, setUser] = React.useState<UserI | undefined>(undefined);
    const [isLoading, setIsLoading] = React.useState(false);
    // if the user has left the lobby, where a message will be displayed
    const [hasLeft, setHasLeft] = React.useState(false);
    // the lobby which will be fetched from the server
    const [lobby, setLobby] = React.useState<{ name: LobbyI['name'] } | undefined>();
    // if the user is about to leave, in order to show the confirmation modal
    const [isLeavingLobby, setIsLeavingLobby] = React.useState(false);

    // when the component is initialized, fetch the user and the lobby from the server
    React.useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const { data } = await apiAxios.get(`/lobbies/${lobbyId}/users/${userId}`);

                setUser(data.user);
                setLobby(data.lobby);
                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);
            }
        }

        fetchUser();
    }, [lobbyId, userId]);

    const leaveLobby = async () => {
        await apiAxios.delete(`/lobbies/${lobbyId}/users/${userId}`);
        setHasLeft(true);
    }

    if (hasLeft) {
        return <>Thanks for participating!</>;
    }

    let leavingLobbyElement = <></>;
    if (isLeavingLobby) {
        leavingLobbyElement =
            <Modal.Dialog>
                <Modal.Body>
                    <p>Really leave?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={leaveLobby}
                    >
                        Leave
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => { setIsLeavingLobby(false); }}
                    >
                        Don't leave
                    </Button>
                </Modal.Footer>
            </Modal.Dialog>;
    }

    let userElement: JSX.Element = <div > Loading </div>;

    const rowStyle: React.CSSProperties = { padding: '3px' };
    const rowClassName = "justify-content-center";
    if (user && user._id && lobby) {
        userElement =
            <Container>
                <Row style={rowStyle} className={rowClassName}>
                    {leavingLobbyElement}
                </Row>
                <Row style={rowStyle} className={rowClassName}>
                    <Col xs='auto'>
                        Welcome to {lobby.name}, {user.name}!
                </Col>
                </Row>
                <Row style={rowStyle} className={rowClassName}>
                    <Col xs='auto'>
                        <UserScore score={user.score} />
                    </Col>
                </Row>
                <Row style={rowStyle} className={rowClassName}>
                    <Col xs='auto'>
                        <ButtonGroup>
                            <ScoreModifyButton
                                disabled={isLoading}
                                lobbyId={lobbyId}
                                userId={userId}
                                direction='negative'
                                onSuccess={(user) => setUser(user)}
                            />
                            <ScoreModifyButton
                                disabled={isLoading}
                                lobbyId={lobbyId}
                                userId={userId}
                                direction='positive'
                                onSuccess={(user) => setUser(user)}
                            />
                        </ButtonGroup>
                    </Col>
                </Row>
                <Row style={rowStyle} className={rowClassName}>
                    <Button
                        variant='danger'
                        size="sm"
                        disabled={isLoading}
                        onClick={() => setIsLeavingLobby(true)}
                    >
                        Leave Lobby
                </Button>
                </Row>
            </Container>
    } else if (!user && !isLoading) {
        userElement = <span> This user cannot be found </span>
    }

    return (
        <div>
            {userElement}
        </div>
    )
}

export default withRouter(User);
