import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { apiAxios } from '../../utils/axios';

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

    }, []);

    let playerElement: JSX.Element = <div > Loading </div>;
    if (player) {
        playerElement = <> R{player.score.rank} - {player.score.stars}<span role="img" aria-label="star">⭐</span></>
    }

    return (
        <div>
            this is a Player component for game {gameId}
            <br />
            {playerElement}
        </div>
    )
}

export default withRouter(Player);
