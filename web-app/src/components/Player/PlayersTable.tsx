import React from 'react';

export const PlayersTable: React.FC<{
    players: any[];
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
                    props.players.map((player: any) => <tr key={player.id}>
                        <td>R{player.score.rank} - {player.score.stars}<span role="img" aria-label="star">⭐</span></td>
                        <td>
                            <a href={`/games/${props.gameId}/players/${player.id}`} target='_blank'>
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
