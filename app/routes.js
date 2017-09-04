import React from 'react';
import { Switch, Route } from 'react-router';
import Home from './containers/Sites/Home';
import Config from './containers/Sites/Config';

export default () =>
  (<Switch>
    <Route exact path="/" component={Home} />
    <Route path="/config" component={Config} />
  </Switch>);
