import React from 'react';
import PlayerScore from './PlayerScore';
import { PlayerI } from '../../types/Player';
import openSocket from 'socket.io-client';
import { GameI } from '../../types/Game';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import qs from 'query-string';

interface playerTablePropsI extends RouteComponentProps<{
    forStream: string;
    maxColumns: string;
}> {
    gameId: string;
    onKick?: (playerId: string) => void;
}

const PlayersTable: React.FC<playerTablePropsI> = (props) => {

    const forStream = qs.parse(props.location.search).forStream;
    // parse it and then cast it to number or undefined
    const _maxColumns = qs.parse(props.location.search).maxColumns;
    const maxColumns = _maxColumns ? +_maxColumns : undefined;

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

    let tableStyle: React.CSSProperties = {};
    if (forStream === 'true') {
        tableStyle = {
            fontSize: '28px',
            WebkitTextFillColor: 'white',
            WebkitTextStrokeWidth: '1px',
            WebkitTextStrokeColor: 'black',
            backgroundColor: `rgba(0,0,0,.1)`,
        }
    }

    return (
        <table style={tableStyle}>
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
                        .slice(0, maxColumns)
                        .sort((p1, p2) => {
                            if (p1.score.rank !== p2.score.rank) {
                                return p1.score.rank > p2.score.rank ? 1 : -1;
                            }
                            if (p1.score.stars !== p2.score.stars) {
                                return p1.score.stars > p2.score.stars ? -1 : 1;
                            }
                            return p1.id > p2.id ? 1 : -1;
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

export default withRouter(PlayersTable);
