import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { useRemoveAccountConfirmationMutation } from './useRemoveAccountConfirmationMutation';
import { checkErrors } from 'errors';
import { ErrorReason } from 'errors/enums';
import { setAccessToken } from 'modules/auth/token';
import { useAppDispatch, useAppState } from 'hooks';
import { setIsAuthenticated } from 'state';
import Content from 'ui/Content';
import Page from 'ui/Page';
import Loader, { LoaderSize } from 'ui/Loader';

interface RouteParams {
  tokenId: string;
}

const RemoveAccountConfirmation: FC = () => {
  const { tokenId } = useParams<RouteParams>();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppState();
  const [removeAccountConfirmation, { error, loading, client }] =
    useRemoveAccountConfirmationMutation();
  let generalErrorMessage;

  useEffect(() => {
    const handleConfirmRemoval = async () => {
      await removeAccountConfirmation({ variables: { tokenId } });

      setAccessToken();

      await client.clearStore();

      dispatch(setIsAuthenticated(false));
    };

    handleConfirmRemoval();
  }, [client, dispatch, removeAccountConfirmation, tokenId]);

  const [ExpiredLinkError, OtherError] = error
    ? checkErrors(ErrorReason.ExpiredLinkError)(error)
    : [];

  if (ExpiredLinkError) {
    generalErrorMessage = 'error.link-has-expired';
  } else if (OtherError) {
    generalErrorMessage = 'error.general';
  }

  const Component = isAuthenticated ? Content : Page;
  const success = !loading && !error;

  return (
    <Component>
      {loading && <Loader size={LoaderSize.Big} />}
      {success && <FormattedMessage id="remove-account.success" />}
      {generalErrorMessage && (
        <div>
          <FormattedMessage id={generalErrorMessage} />
        </div>
      )}
    </Component>
  );
};

export default RemoveAccountConfirmation;
