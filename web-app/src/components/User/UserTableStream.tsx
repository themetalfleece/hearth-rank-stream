import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import UserTable from './UserTable';

const UserTableStream: React.FC<
    RouteComponentProps<{
        lobbyId: string;
    }>
> = (props) => {
    return (
        <UserTable
            lobbyId={props.match.params.lobbyId}
        />
    );
};

export default withRouter(UserTableStream);
