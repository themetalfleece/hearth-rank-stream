import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ModActions from './components/Mod/ModActions';
import Player from './components/Player/Player';
import ModDashboard from './components/Mod/ModDashboard';
import PlayersTableStream from './components/Player/PlayersTableStream';

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
        <Route path={['/games/:gameId/players/:playerId']}>
          <Player />
        </Route>
        <Route path={['/games/:gameId/']}>
          <PlayersTableStream />
        </Route>
        <Route>
          Invalid route
        </Route>
      </Switch>
    </div>
  );
}

export default App;
