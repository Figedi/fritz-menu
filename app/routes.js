import React from 'react';
import { Switch, Route } from 'react-router';
import { Sites } from './containers';

export default () =>
  (<Switch>
    <Route exact path="/" component={Sites.Home} />
    <Route path="/config" component={Sites.Config} />
  </Switch>);
