import React from 'react';
import PlayerScore from './PlayerScore';
import { PlayerI } from '../../types/Player';
import openSocket from 'socket.io-client';
import { GameI } from '../../types/Game';

export const PlayersTable: React.FC<{
    gameId: string;
    onKick?: (playerId: string) => void;
}> = (props) => {

    const [players, setPlayers] = React.useState<PlayerI[]>([]);

    React.useEffect(() => {
        const socket = openSocket('http://localhost:3000');
        socket.emit('join-game', { gameId: props.gameId });

        socket.on('game-info', (data: { game: GameI }) => {
            setPlayers(data.game.players);
        });

        return () => {
            socket.close();
        }
    }, [props.gameId]);

    return (
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    {props.onKick ? <th>Kick</th> : null}
                </tr>
            </thead>
            <tbody>
                {
                    players
                        .sort((p1, p2) => {
                            if (p1.score.rank > p2.score.rank) { return 1; }
                            if (p1.score.rank < p2.score.rank) { return -1; }
                            if (p1.score.stars < p2.score.stars) { return 1; }
                            if (p1.score.stars > p2.score.stars) { return -1; }
                            return 1;
                        })
                        .map((player) => <tr key={player.id}>
                            <td><PlayerScore score={player.score} /></td>
                            <td>
                                <a href={`/games/${props.gameId}/players/${player.id}`} target='_blank' rel="noopener noreferrer">
                                    {player.name}
                                </a>
                            </td>
                            {
                                props.onKick ?
                                    <td
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => props.onKick && props.onKick(player.id)}
                                    ><span role="img" aria-label="kick">🚫</span></td>
                                    : null
                            }
                        </tr>)
                }
            </tbody>
        </table>
    );
}
