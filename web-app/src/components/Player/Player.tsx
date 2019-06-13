import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { apiAxios } from '../../utils/axios';
import PlayerScore from './PlayerScore';

const ScoreModifyButton: React.FC<{
    playerId: string;
    gameId: string;
    direction: 'positive' | 'negative';
    onSuccess: (player: object) => void;
}> = (props) => {
    const onClick: VoidFunction = async () => {
        const res = await apiAxios.put(`/games/${props.gameId}/players/${props.playerId}`, {
            by: props.direction === 'positive' ? 1 : -1,
        });
        props.onSuccess(res.data.player);
    };

    return (
        <button onClick={onClick}>{props.direction === 'positive' ? '+' : '-'}</button>
    );
};

const Player: React.FC<
    RouteComponentProps<{
        gameId: string;
        playerId: string;
    }>
> = (props) => {
    const gameId = props.match.params.gameId;
    const playerId = props.match.params.playerId;

    const [player, setPlayer] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchPlayer = async () => {
            setIsLoading(true);
            try {
                const { data } = await apiAxios.get(`/games/${gameId}/players/${playerId}`);

                setPlayer(data.player);
                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);
            }
        }

        fetchPlayer();
    }, [gameId, playerId]);

    let playerElement: JSX.Element = <div > Loading </div>;
    if (player) {
        playerElement = <>
            Welcome {player.name}
            <br />
            <PlayerScore score={player.score} />
            <br />
            <ScoreModifyButton
                gameId={gameId}
                playerId={playerId}
                direction='negative'
                onSuccess={(player) => setPlayer(player)}
            />
            <ScoreModifyButton
                gameId={gameId}
                playerId={playerId}
                direction='positive'
                onSuccess={(player) => setPlayer(player)}
            />
        </>
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
