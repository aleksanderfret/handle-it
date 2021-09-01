import getIntl from '@translations/intl';
import { AuthMailData, MailDataCreator } from '../types';
import { Link, Paragraph } from './components';

const RemoveAccountConfirmation: MailDataCreator<AuthMailData> = mailData => {
  const {
    locale,
    recipient,
    redirectUrl,
    user: { email }
  } = mailData;
  const { formatMessage: f } = getIntl(locale);

  const title = f({ id: 'mail.remove-account.title' });
  const content = Paragraph()(
    f({ id: 'mail.remove-account.message' }, { email }),
    Link({ href: redirectUrl })(f({ id: 'mail.remove-account.confirm-link' }))
  );

  const data = { content, locale, title };

  return { data, recipient, subject: title };
};

export default RemoveAccountConfirmation;
