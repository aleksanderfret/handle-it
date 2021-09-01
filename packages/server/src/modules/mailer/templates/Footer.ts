import environment from '@env/env';
import getIntl from '@translations/intl';
import { MailComponentsProps } from '@modules/mailer/types';
import {
  Cell,
  Link,
  Paragraph,
  Row
} from '@modules/mailer/templates/components';

const {
  APP_NAME,
  COMPANY_ADDRESS,
  COMPANY_EMAIL,
  COMPANY_NAME,
  COMPANY_PHONE
} = environment;
const address = COMPANY_ADDRESS.replace(/_/g, ' ');
const phone = COMPANY_PHONE.replace(/_/g, ' ');

const Footer = ({ locale = 'en', ...rest }: MailComponentsProps) => {
  const { formatMessage: f } = getIntl(locale);

  return Row(rest)(
    Cell()(
      Paragraph({ key: 'App Info' })(
        f(
          { id: 'mail.footer.service-provider' },
          { app: APP_NAME, company: COMPANY_NAME }
        )
      ),
      Paragraph({ key: 'Address' })(
        `${f({ id: 'mail.footer.address-label' })}: ${address}.`
      ),
      Paragraph({ key: 'Contact' })(
        `${f({ id: 'mail.footer.contact-label' })}: `,
        Link({ href: `tel:${phone}` })(phone),
        ' | ',
        Link({
          href: `mailto:${COMPANY_EMAIL}`
        })(COMPANY_EMAIL)
      )
    )
  );
};

export default Footer;
