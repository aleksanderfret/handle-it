import { TokenRefreshLink } from 'apollo-link-token-refresh';

import { isTokenExpired, refreshToken } from 'modules/auth/utils';
import { getAccessToken, setAccessToken } from 'modules/auth/token';

const refreshTokenLink = new TokenRefreshLink({
  accessTokenField: 'accessToken',
  fetchAccessToken: refreshToken,
  handleError: err => {
    if (err) {
      // TODO logout | redirect | etc
      // window.location.href = '/';
    }
  },
  handleFetch: accessToken => {
    setAccessToken(accessToken);
  },
  handleResponse:
    (operation, accessTokenField) => async (response: Response) => {
      try {
        const { accessToken } = await response.json();

        if (!accessToken) {
          throw new Error();
        }

        return { accessToken };
      } catch (error) {
        throw new Error(`Nie ma ${accessTokenField}! Nie da rady ${operation}`);
      }
    },
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();

    try {
      return typeof token !== 'string' || !isTokenExpired(token);
    } catch {
      return false;
    }
  }
});

export default refreshTokenLink;
