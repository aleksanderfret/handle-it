import SendGridMail from '@sendgrid/mail';

import environment from '@env/env';
import {
  Mail,
  MessageData,
  Send,
  SendMailResult,
  SignUpMail,
  ResetPasswordMail
} from './types';
import EmailTemplate from './enums';
import SignUpConfirmation from './templates/SignUpConfirmation';
import ResetPasswordConfirmation from './templates/ResetPasswordConfirmation';

const { SENDER_EMAIL, SENDGRID_API_KEY } = environment;

SendGridMail.setApiKey(SENDGRID_API_KEY);

const templates = {
  [EmailTemplate.SignUp]: SignUpConfirmation,
  [EmailTemplate.ResetPassword]: ResetPasswordConfirmation
};

const sendMessage = (send: Send) => <T extends Mail>(template: T[0]) => (
  data: T[1]
) => {
  const mailTemplate = templates[template];

  return send(mailTemplate(data));
};

const send = async (messageData: MessageData): SendMailResult => {
  const { recipient, subject, html } = messageData;

  const message = {
    from: SENDER_EMAIL,
    html,
    subject,
    to: recipient
  };

  return SendGridMail.send(message);
};

const sendMail = sendMessage(send);

export const sendSignUpConfirmation = sendMail<SignUpMail>(
  EmailTemplate.SignUp
);

export const sendResetPasswordConfirmation = sendMail<ResetPasswordMail>(
  EmailTemplate.ResetPassword
);
