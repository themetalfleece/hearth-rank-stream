import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ModActions from './components/Mod/ModActions';
import Player from './components/Player/Player';
import ModDashboard from './components/Mod/ModDashboard';

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
        <Route path={['/', '/player']}>
          <Player />
        </Route>
        <Route>
          Invalid route
        </Route>
      </Switch>
    </div>
  );
}

export default App;
