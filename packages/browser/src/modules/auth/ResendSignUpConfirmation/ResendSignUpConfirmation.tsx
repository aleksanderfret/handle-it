import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { useResendSignUpConfirmationMutation } from './useResendSignUpConfirmationMutation';
import ResendConfirmationView from 'modules/auth/ResendConfirmationView';

interface RouteParams {
  tokenId: string;
}

const ResendSignUpConfirmation: FC = () => {
  const { tokenId } = useParams<RouteParams>();

  const [resendSignUpConfirmation, { error, loading }] =
    useResendSignUpConfirmationMutation();

  const handleResendConfirmationLink = async (): Promise<Boolean> => {
    const response = await resendSignUpConfirmation({
      variables: { tokenId }
    });

    if (response) {
      return true;
    }

    return false;
  };

  return (
    <div>
      <div>
        <FormattedMessage id="error.link-has-expired" />{' '}
        <FormattedMessage id="try-again" />.
      </div>
      <ResendConfirmationView
        error={error}
        loading={loading}
        onClick={handleResendConfirmationLink}
      />
    </div>
  );
};

export default ResendSignUpConfirmation;
