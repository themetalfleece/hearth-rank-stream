import React from 'react';
import PlayerScore from './PlayerScore';
import clone from 'clone';
import { PlayerI } from '../../types/Player';

export const PlayersTable: React.FC<{
    players: PlayerI[];
    gameId: string;
    onKick?: (playerId: string) => void;
}> = (props) => {
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
                    clone(props.players)
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
