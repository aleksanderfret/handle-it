import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { useRetrySignUpConfirmationMutation } from './useRetrySignUpConfirmationMutation';
import ResendConfirmationView from 'modules/auth/ResendConfirmationView';

interface RetrySignUpConfirmationProps {
  email: string;
}

const RetrySignUpConfirmation: FC<RetrySignUpConfirmationProps> = ({
  email
}) => {
  const [retrySignUpConfirmation, { error, loading }] =
    useRetrySignUpConfirmationMutation();

  const handleRetrySignUpConfirmation = async (): Promise<Boolean> => {
    const response = await retrySignUpConfirmation({
      variables: { email }
    });

    if (response) {
      return true;
    }

    return false;
  };

  return (
    <div>
      <div>
        <FormattedMessage id="sign-up.confirmation.retry" values={{ email }} />
      </div>
      <ResendConfirmationView
        error={error}
        loading={loading}
        onClick={handleRetrySignUpConfirmation}
      />
    </div>
  );
};

export default RetrySignUpConfirmation;
