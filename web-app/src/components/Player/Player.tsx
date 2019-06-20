import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { apiAxios } from '../../utils/axios';
import PlayerScore from './PlayerScore';
import { PlayerI } from '../../types/Player';
import { Button, ButtonGroup, Container, Row, Col } from 'react-bootstrap';

const ScoreModifyButton: React.FC<{
    disabled: boolean;
    playerId: string;
    lobbyId: string;
    direction: 'positive' | 'negative';
    onSuccess: (player: PlayerI) => void;
}> = (props) => {
    const onClick: VoidFunction = async () => {
        const res = await apiAxios.put(`/lobbies/${props.lobbyId}/players/${props.playerId}`, {
            by: props.direction === 'positive' ? 1 : -1,
        });
        props.onSuccess(res.data.player);
    };

    return (
        <Button variant="dark" size="lg" disabled={props.disabled} onClick={onClick}>{props.direction === 'positive' ? '+' : '-'}</Button>
    );
};

const Player: React.FC<
    RouteComponentProps<{
        lobbyId: string;
        playerId: string;
    }>
> = (props) => {
    const lobbyId = props.match.params.lobbyId;
    const playerId = props.match.params.playerId;

    const [player, setPlayer] = React.useState<PlayerI>({
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
        const fetchPlayer = async () => {
            setIsLoading(true);
            try {
                const { data } = await apiAxios.get(`/lobbies/${lobbyId}/players/${playerId}`);

                setPlayer(data.player);
                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);
            }
        }

        fetchPlayer();
    }, [lobbyId, playerId]);

    const leaveLobby = async () => {
        await apiAxios.delete(`/lobbies/${lobbyId}/players/${playerId}`);
        setHasLeft(true);
    }

    if (hasLeft) {
        return <>Thanks for playing!</>;
    }

    let playerElement: JSX.Element = <div > Loading </div>;
    const rowStyle: React.CSSProperties = { padding: '3px' };
    const rowClassName = "justify-content-center";
    if (player._id) {
        playerElement = <Container>
            <Row style={rowStyle} className={rowClassName}>
                <Col xs='auto'>
                    Welcome {player.name}
                </Col>
            </Row>
            <Row style={rowStyle} className={rowClassName}>
                <Col xs='auto'>
                    <PlayerScore score={player.score} />
                </Col>
            </Row>
            <Row style={rowStyle} className={rowClassName}>
                <Col xs='auto'>
                    <ButtonGroup>
                        <ScoreModifyButton
                            disabled={isLoading}
                            lobbyId={lobbyId}
                            playerId={playerId}
                            direction='negative'
                            onSuccess={(player) => setPlayer(player)}
                        />
                        <ScoreModifyButton
                            disabled={isLoading}
                            lobbyId={lobbyId}
                            playerId={playerId}
                            direction='positive'
                            onSuccess={(player) => setPlayer(player)}
                        />
                    </ButtonGroup>
                </Col>
            </Row>
            <Row style={rowStyle} className={rowClassName}>
                <Button variant='danger' size="sm" disabled={isLoading} onClick={leaveLobby}>Leave Lobby</Button>
            </Row>
        </Container>
    }
    if (!player && !isLoading) {
        playerElement = <span> This player cannot be found </span>
    }

    return (
        <div>
            {playerElement}
        </div>
    )
}

export default withRouter(Player);
