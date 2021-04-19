import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { ChangePassword } from 'modules/auth';
import Content from 'ui/Content';

const Account: FC = () => (
  <Content>
    <div>
      <h2>
        <FormattedMessage id="account" />
      </h2>
      <div>
        <ChangePassword />
      </div>
    </div>
  </Content>
);

export default Account;
