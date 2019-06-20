import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import PlayersTable from './PlayersTable';

const PlayerTableStream: React.FC<
    RouteComponentProps<{
        lobbyId: string;
    }>
> = (props) => {
    return (
        <PlayersTable
            lobbyId={props.match.params.lobbyId}
        />
    );
};

export default withRouter(PlayerTableStream);
