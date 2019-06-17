import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import PlayersTable from './PlayersTable';

const PlayerTableStream: React.FC<
    RouteComponentProps<{
        gameId: string;
    }>
> = (props) => {
    return (
        <PlayersTable
            gameId={props.match.params.gameId}
        />
    );
};

export default withRouter(PlayerTableStream);
