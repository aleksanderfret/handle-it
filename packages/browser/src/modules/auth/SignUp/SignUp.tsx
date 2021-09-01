import React, { FC, FormEvent, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useSignUpMutation } from './useSignUpMutation';
import RetrySignUpConfirmation from 'modules/auth/RetrySignUpConfirmation';
import { InputChangeHandler } from 'constants/types';
import { checkErrors } from 'errors';
import { ErrorReason } from 'errors/enums';
import Page from 'ui/Page';
import { AsyncButton, Button } from 'ui/Button';

import './SignUp.scss';

export const SignUp: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [registered, setRegistered] = useState(false);
  const [signUp, { error, loading }] = useSignUpMutation();

  const handleEmailChange: InputChangeHandler = event => {
    setEmail(event.target.value);
  };

  const handlePasswordChange: InputChangeHandler = event => {
    setPassword(event.target.value);
  };

  const handlePasswordConfirmationChange: InputChangeHandler = event => {
    setPasswordConfirmation(event.target.value);
  };

  const handleSignUp = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    if (
      !email ||
      !password ||
      !passwordConfirmation ||
      password !== passwordConfirmation
    ) {
      return;
    }

    const response = await signUp({
      variables: { email, password, passwordConfirmation }
    });

    if (response) {
      setRegistered(true);
    }
  };

  const handleReset = () => {
    setRegistered(false);
    setEmail('');
    setPassword('');
  };

  const [specificErrors = {}, OtherError] = error
    ? checkErrors([
        ErrorReason.AlreadyExistsError,
        ErrorReason.PasswordMismatch,
        ErrorReason.SendingFailedError
      ])(error)
    : [];
  const { AlreadyExistsError, PasswordMismatch, SendingFailedError } =
    specificErrors;

  const success = !error && !loading && registered;

  return (
    <Page>
      {success ? (
        <div>
          <p>
            <FormattedMessage
              id="sign-up.success.message"
              values={{
                email
              }}
            />
          </p>
          <p>
            <Button onClick={handleReset}>
              <FormattedMessage id="sign-up.again" />
            </Button>
          </p>
        </div>
      ) : SendingFailedError ? (
        <RetrySignUpConfirmation email={email} />
      ) : (
        <form onSubmit={handleSignUp}>
          <div>
            <label>
              <FormattedMessage id="email" />
              <input onChange={handleEmailChange} type="text" value={email} />
            </label>
          </div>
          <div>
            <label>
              <FormattedMessage id="password" />
              <input
                onChange={handlePasswordChange}
                type="password"
                value={password}
              />
            </label>
          </div>
          <div>
            <label>
              <FormattedMessage id="password.confirm" />
              <input
                onChange={handlePasswordConfirmationChange}
                type="password"
                value={passwordConfirmation}
              />
            </label>
            {PasswordMismatch && (
              <div>
                <FormattedMessage id="error.password.mismatch" />
              </div>
            )}
          </div>
          <div>
            <AsyncButton loading={loading} type="submit">
              <FormattedMessage id="sign-up" />
            </AsyncButton>
          </div>
          {AlreadyExistsError && (
            <div>
              <FormattedMessage id="error.user-exist" />
            </div>
          )}
          {OtherError && (
            <div>
              <FormattedMessage id="error.general" />
            </div>
          )}
        </form>
      )}
    </Page>
  );
};

export default SignUp;
