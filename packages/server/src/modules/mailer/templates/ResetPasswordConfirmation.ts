import { AuthMailData, MailDataCreator } from '../types';

const ResetPasswordConfirmation: MailDataCreator<AuthMailData> = mailData => {
  const { recipient } = mailData;
  const subject = 'title';
  const content = ['aasd ', 'aasd ', 'aasd ', 'aasd ', 'aasd.'];
  const title = 'mail title';
  const data = { content, title };

  return { data, recipient, subject };
};

export default ResetPasswordConfirmation;
