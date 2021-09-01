import React, { FC, FormEvent, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useRemoveAccountMutation } from './useRemoveAccountMutation';
import { InputChangeHandler } from 'constants/types';
import { checkErrors } from 'errors';
import { ErrorReason } from 'errors/enums';
import { AsyncButton } from 'ui/Button';

const RemoveAccount: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sent, setSent] = useState(false);
  const [removeAccount, { error, loading }] = useRemoveAccountMutation();
  let generalErrorMessage;

  const handleEmailChange: InputChangeHandler = event => {
    setEmail(event.target.value);
  };

  const handlePasswordChange: InputChangeHandler = event => {
    setPassword(event.target.value);
  };

  const handleRemoveAccount = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    if (!email || !password) {
      return;
    }

    const response = await removeAccount({ variables: { email, password } });

    if (response) {
      setSent(true);
      setEmail('');
      setPassword('');
    }
  };

  const [specificErrors = {}, OtherError] = error
    ? checkErrors([
        ErrorReason.InvalidCredentialsError,
        ErrorReason.SendingFailedError
      ])(error)
    : [];
  const { InvalidCredentialsError, SendingFailedError } = specificErrors;

  if (InvalidCredentialsError) {
    generalErrorMessage = 'error.invalid-credentials';
  } else if (OtherError) {
    generalErrorMessage = 'error.general';
  }

  const success = !error && !loading && sent;

  return success ? (
    <div>
      <p>
        <FormattedMessage id="auth.remove-account.success" values={{ email }} />
      </p>
    </div>
  ) : (
    <form onSubmit={handleRemoveAccount}>
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
        <AsyncButton loading={loading} type="submit">
          <FormattedMessage id="auth.remove-account" />
        </AsyncButton>
      </div>
      {generalErrorMessage && (
        <div>
          <FormattedMessage id={generalErrorMessage} />
        </div>
      )}
      {SendingFailedError && (
        <div>
          <FormattedMessage id="error.sending-confirmation-failed" />{' '}
          <FormattedMessage id="try again" />
        </div>
      )}
    </form>
  );
};

export default RemoveAccount;
