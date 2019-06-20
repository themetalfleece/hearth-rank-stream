import React from 'react';
import UserScore from './UserScore';
import { UserI } from '../../types/User';
import { openSocket } from '../../utils/websockets';
import { LobbyI } from '../../types/Lobby';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import qs from 'query-string';

interface userTablePropsI extends RouteComponentProps<{
    forStream: string;
    maxColumns: string;
}> {
    lobbyId: string;
    onKick?: (userId: UserI) => void;
}

const UserTable: React.FC<userTablePropsI> = (props) => {

    const forStream = qs.parse(props.location.search).forStream;
    // parse it and then cast it to number or undefined
    const _maxColumns = qs.parse(props.location.search).maxColumns;
    const maxColumns = _maxColumns ? +_maxColumns : undefined;

    const [users, setUsers] = React.useState<UserI[]>([]);

    React.useEffect(() => {
        const socket = openSocket();
        socket.emit('join-lobby', { lobbyId: props.lobbyId });

        socket.on('lobby-info', (data: { lobby: LobbyI }) => {
            setUsers(data.lobby.users);
        });

        return () => {
            socket.close();
        }
    }, [props.lobbyId]);

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
                    users
                        .sort((p1, p2) => {
                            if (p1.score.rank !== p2.score.rank) {
                                return p1.score.rank > p2.score.rank ? 1 : -1;
                            }
                            if (p1.score.stars !== p2.score.stars) {
                                return p1.score.stars > p2.score.stars ? -1 : 1;
                            }
                            return p1._id > p2._id ? 1 : -1;
                        })
                        .slice(0, maxColumns)
                        .map((user) => <tr key={user._id}>
                            <td><UserScore score={user.score} /></td>
                            <td>
                                <a href={`/lobbies/${props.lobbyId}/users/${user._id}`} target='_blank' rel="noopener noreferrer">
                                    <div style={{ width: '100%', height: '100%' }}>
                                        {user.name}
                                    </div>
                                </a>
                            </td>
                            {
                                props.onKick ?
                                    <td
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => props.onKick && props.onKick(user)}
                                    ><span role="img" aria-label="kick">🚫</span></td>
                                    : null
                            }
                        </tr>)
                }
            </tbody>
        </table>
    );
}

export default withRouter(UserTable);
