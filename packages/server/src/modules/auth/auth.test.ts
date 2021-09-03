import { verify } from 'jsonwebtoken';

import { createAccessToken, JwtPayload } from './auth';
import environment from '@env/env';

const { ACCESS_PUBLIC_KEY } = environment;
const publicKey = Buffer.from(ACCESS_PUBLIC_KEY, 'base64').toString('utf-8');

describe('authorization utils', () => {
  test('createAccessToken should generate a token', () => {
    const token = createAccessToken('testUserId');

    const payload = verify(token, publicKey) as JwtPayload;

    expect(payload.userId).toBe('testUserId');
  });
});
