import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import UserTable from './UserTable';

/* displaying the user table so it's suitable for embedding it in streams */
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
