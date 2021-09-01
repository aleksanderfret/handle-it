import React, { FC } from 'react';
import { Switch } from 'react-router-dom';

import Dashboard from 'modules/dashboard';
import {
  RemoveAccountConfirmation,
  ResetPassword,
  SignIn,
  SignUp,
  SignUpConfirmation,
  UpdatePassword
} from 'modules/auth';
import { Account, Bye } from 'modules/user';
import Home from 'modules/home';
import { ContentNotFound, PageNotFound } from 'modules/notFound';
import { Path, PrivateRoute, PublicRoute } from 'router';
import Header from './Header';
import LeftBar from './LeftBar';
import RightBar from './RightBar';
import TopBar from './TopBar';

import './Layout.scss';

export const Layout: FC = () => (
  <div className="layout">
    <Switch>
      <PublicRoute component={Header} noFallback />
    </Switch>
    <Switch>
      <PublicRoute component={Home} exact path={Path.Home} />
      <PublicRoute component={SignIn} exact path={Path.SignIn} />
      <PublicRoute component={SignUp} exact path={Path.SignUp} />
      <PublicRoute
        component={SignUpConfirmation}
        exact
        path={Path.SignUpConfirmation}
      />
      <PublicRoute
        component={RemoveAccountConfirmation}
        exact
        path={Path.RemoveAccount}
      />
      <PublicRoute component={ResetPassword} exact path={Path.ResetPassword} />
      <PublicRoute
        component={UpdatePassword}
        exact
        path={Path.UpdatePassword}
      />
      <PublicRoute component={PageNotFound} noFallback />
    </Switch>
    <Switch>
      <PrivateRoute component={TopBar} noFallback />
    </Switch>
    <Switch>
      <PrivateRoute component={LeftBar} noFallback />
    </Switch>
    <Switch>
      <PrivateRoute
        component={RemoveAccountConfirmation}
        exact
        path={Path.RemoveAccount}
      />
      <PrivateRoute component={Bye} exact path={Path.Organizations} />
      <PrivateRoute component={Dashboard} exact path={Path.Dashboard} />
      <PrivateRoute component={Account} exact path={Path.Account} />
      <PrivateRoute component={ContentNotFound} noFallback />
    </Switch>
    <Switch>
      <PrivateRoute component={RightBar} noFallback />
    </Switch>
  </div>
);

export default Layout;
