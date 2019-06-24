import React from 'react';
import UserScore from './UserScore';
import { UserI } from '../../types/User';
import { openSocket } from '../../utils/websockets';
import { LobbyI } from '../../types/Lobby';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import CopyToClipboard from 'react-copy-to-clipboard';
import qs from 'query-string';
import { UserKeyI } from '../../types/UserKey';

interface userTablePropsI extends RouteComponentProps<{
    // from the url
    /** to change the style for embedding it into streams */
    forStream: string;
    maxColumns: string;
}> {
    // as component props
    lobbyId: string;
    onKick?: (userId: UserI) => void;
}

const UserTable: React.FC<userTablePropsI> = (props) => {

    const forStream = qs.parse(props.location.search).forStream;
    // parse it and then cast it to number or undefined
    const _maxColumns = qs.parse(props.location.search).maxColumns;
    const maxColumns = _maxColumns ? +_maxColumns : undefined;

    // the users which will be fetched via socket data
    const [users, setUsers] = React.useState<UserI[]>([]);
    // player keys, will be set only for mods
    const [userKeys, setUserKeys] = React.useState<UserKeyI[]>([]);

    React.useEffect(() => {
        const socket = openSocket();
        // on connection, emit the join-lobby event
        socket.emit('join-lobby', { lobbyId: props.lobbyId });

        // on socket reconnect, fetch the lobby again
        socket.on('reconnect', () => {
            socket.emit('join-lobby', { lobbyId: props.lobbyId });
        })

        // lobby-info in the event which arrived each time anything regarding the users has changed
        socket.on('lobby-info', (data: { lobby: LobbyI, userKeys: UserKeyI[] }) => {
            setUsers(data.lobby.users);
            if (data.userKeys) {
                setUserKeys(data.userKeys);
            }
        });

        // close the socket when closing
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
                            // sort by lower rank first, then greater stars
                            if (p1.score.rank !== p2.score.rank) {
                                return p1.score.rank > p2.score.rank ? 1 : -1;
                            }
                            if (p1.score.stars !== p2.score.stars) {
                                return p1.score.stars > p2.score.stars ? -1 : 1;
                            }
                            return p1._id > p2._id ? 1 : -1;
                        })
                        .slice(0, maxColumns)
                        .map((user) => {
                            const userKey = userKeys.find((userKey) => userKey.userId === user._id);
                            const playerNameElement = <div style={{ width: '100%', height: '100%' }}>
                                {user.name}
                            </div>;
                            return <tr key={user._id}>
                                <td><UserScore score={user.score} /></td>
                                <td style={{ cursor: 'pointer' }}>
                                    {/* on player click, copy the corresponding userKey if it exists */}
                                    {!userKey ? playerNameElement :
                                        <CopyToClipboard text={userKey ? userKey.key : ''}>
                                            {playerNameElement}
                                        </CopyToClipboard>
                                    }
                                </td>
                                {
                                    props.onKick ?
                                        <td
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => props.onKick && props.onKick(user)}
                                        ><span role="img" aria-label="kick">🚫</span></td>
                                        : null
                                }
                            </tr>
                        })
                }
            </tbody>
        </table>
    );
}

export default withRouter(UserTable);
