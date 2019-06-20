import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { apiAxios } from '../../utils/axios';
import UserScore from './UserScore';
import { UserI } from '../../types/User';
import { Button, ButtonGroup, Container, Row, Col } from 'react-bootstrap';

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

    const [user, setUser] = React.useState<UserI>({
        name: '',
        _id: '',
        score: {
            rank: 0,
            stars: 0,
        },
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [hasLeft, setHasLeft] = React.useState(false);

    React.useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const { data } = await apiAxios.get(`/lobbies/${lobbyId}/users/${userId}`);

                setUser(data.user);
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
        return <>Thanks for playing!</>;
    }

    let userElement: JSX.Element = <div > Loading </div>;
    const rowStyle: React.CSSProperties = { padding: '3px' };
    const rowClassName = "justify-content-center";
    if (user._id) {
        userElement = <Container>
            <Row style={rowStyle} className={rowClassName}>
                <Col xs='auto'>
                    Welcome {user.name}
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
                <Button variant='danger' size="sm" disabled={isLoading} onClick={leaveLobby}>Leave Lobby</Button>
            </Row>
        </Container>
    }
    if (!user && !isLoading) {
        userElement = <span> This user cannot be found </span>
    }

    return (
        <div>
            {userElement}
        </div>
    )
}

export default withRouter(User);
