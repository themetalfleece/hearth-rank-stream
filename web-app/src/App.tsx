import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ModActions from './components/Mod/ModActions';
import User from './components/User/User';
import ModDashboard from './components/Mod/ModDashboard';
import UserTableStream from './components/User/UserTableStream';
import AuthenticatePage from './components/Authenticate/AuthenticatePage';

const App: React.FC = () => {
  return (
    <div className="App">
      <Switch>
        <Route path='/mod' exact={true}>
          <ModActions />
        </Route>
        <Route path='/mod/:id'>
          <ModDashboard />
        </Route>
        <Route path={['/lobbies/:lobbyId/users/:userId']}>
          <User />
        </Route>
        <Route path={['/lobbies/:lobbyId/']}>
          <UserTableStream />
        </Route>
        <Route path={['/']}>
          <AuthenticatePage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
