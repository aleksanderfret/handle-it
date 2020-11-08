import React, { FC } from 'react';
import {
  Route,
  Redirect,
  RouteProps as SourceRouteProps,
  RouteComponentProps
} from 'react-router-dom';

import Path from './enums';
import { useAppState } from 'hooks';

interface RouteProps extends SourceRouteProps {
  noFallback?: boolean;
  path?: Path;
}

interface BaseRouteProps extends RouteProps {
  permitted: boolean;
  redirectPath: Path;
}

const BaseRoute: FC<BaseRouteProps> = ({
  component: Component,
  permitted,
  redirectPath,
  render,
  noFallback,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props: RouteComponentProps) => {
      if (permitted) {
        if (Component) {
          return <Component {...props} />;
        }

        if (render) {
          return render(props);
        }
      }

      return noFallback ? null : <Redirect to={redirectPath} />;
    }}
  />
);

export const PrivateRoute: FC<RouteProps> = props => {
  const {
    state: { isAuthenticated }
  } = useAppState();

  return (
    <BaseRoute
      permitted={isAuthenticated}
      redirectPath={Path.SignIn}
      {...props}
    />
  );
};

export const PublicRoute: FC<RouteProps> = props => {
  const {
    state: { isAuthenticated }
  } = useAppState();

  return (
    <BaseRoute
      permitted={!isAuthenticated}
      redirectPath={Path.Dashboard}
      {...props}
    />
  );
};
