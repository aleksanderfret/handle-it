import SendGridMail from '@sendgrid/mail';
import { ReactNode } from 'react';

import { Locale } from '@shared/types';
import EmailTemplate from './enums';

export type SendMailResult = ReturnType<typeof SendGridMail.send>;
export interface MailTemplate {
  subject: string;
  html: string;
}

interface User {
  avatar?: string;
  email: string;
  name?: string;
  url?: string;
}

interface Task {
  name: string;
  url?: string;
}

interface Project {
  name: string;
  url?: string;
}

interface Organization {
  name: string;
  url?: string;
}

export interface MailContent {
  content: ReactNode;
  locale: Locale;
  title: string;
}

export interface MailData {
  data: MailContent;
  recipient: string;
  subject: string;
}

export interface MessageData {
  html: string;
  recipient: string;
  subject: string;
}
export interface Data {
  doer: User;
  locale: Locale;
  organization: Organization;
  project: Project;
  recipient: string;
  redirectUrl: string;
  task: Task;
  user: User;
}

export type AuthMailData = Pick<
  Data,
  'locale' | 'recipient' | 'redirectUrl' | 'user'
>;

export type MailDataCreator<T> = (data: T) => MailData;

export type Send = (messageData: MessageData) => SendMailResult;

export type SignUpMail = [
  EmailTemplate.SignUp,
  { locale: Locale; recipient: string; redirectUrl: string; user: User }
];

export type RemoveAccountMail = [
  EmailTemplate.RemoveAccount,
  { locale: Locale; recipient: string; redirectUrl: string; user: User }
];

export type ResetPasswordMail = [
  EmailTemplate.ResetPassword,
  { locale: Locale; recipient: string; redirectUrl: string; user: User }
];

export type Mail = SignUpMail | RemoveAccountMail | ResetPasswordMail;

export interface MailComponentsProps {
  key: string;
  locale?: Locale;
}
