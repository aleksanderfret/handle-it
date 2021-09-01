import environment from '@env/env';
import { MailComponentsProps } from '@modules/mailer/types';
import {
  Cell,
  Link,
  Paragraph,
  Row
} from '@modules/mailer/templates/components';

const { APP_NAME, APP_URL } = environment;

const Header = (props: MailComponentsProps) =>
  Row(props)(Cell()(Paragraph()(Link({ href: APP_URL })(APP_NAME))));

export default Header;
