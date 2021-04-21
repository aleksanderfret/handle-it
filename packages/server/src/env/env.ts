const {
  ACCESS_PRIVATE_KEY = '',
  ACCESS_PUBLIC_KEY = '',
  ACCESS_TOKEN_EXP = '',
  APP_NAME = '',
  CLIENT_HOST = '',
  COMPANY_ADDRESS = '',
  COMPANY_EMAIL = '',
  COMPANY_NAME = '',
  COMPANY_PHONE = '',
  CONFIRM_SIGN_UP_TOKEN_EXP = '',
  HOST = '',
  NODE_ENV = '',
  PORT = '',
  PROTOCOL = '',
  REFRESH_PRIVATE_KEY = '',
  REFRESH_PUBLIC_KEY = '',
  REFRESH_TOKEN_EXP = '',
  REMOVE_ACCOUNT_TOKEN_EXP = '',
  RESET_PASSWORD_TOKEN_EXP = '',
  SENDER_EMAIL = '',
  SENDGRID_API_KEY = '',
  TOKEN_PRIVATE_KEY = '',
  TOKEN_PUBLIC_KEY = ''
} = process.env;

const environment = {
  ACCESS_PRIVATE_KEY,
  ACCESS_PUBLIC_KEY,
  ACCESS_TOKEN_EXP: Number(ACCESS_TOKEN_EXP),
  APP_NAME,
  APP_URL:
    NODE_ENV === 'development'
      ? `${PROTOCOL}${CLIENT_HOST}`
      : `${PROTOCOL}${HOST}`,
  COMPANY_ADDRESS,
  COMPANY_EMAIL,
  COMPANY_NAME,
  COMPANY_PHONE,
  CONFIRM_SIGN_UP_TOKEN_EXP: Number(CONFIRM_SIGN_UP_TOKEN_EXP),
  HOST,
  NODE_ENV,
  PORT: Number(PORT),
  PROTOCOL,
  REFRESH_PRIVATE_KEY,
  REFRESH_PUBLIC_KEY,
  REFRESH_TOKEN_EXP: Number(REFRESH_TOKEN_EXP),
  REMOVE_ACCOUNT_TOKEN_EXP: Number(REMOVE_ACCOUNT_TOKEN_EXP),
  RESET_PASSWORD_TOKEN_EXP: Number(RESET_PASSWORD_TOKEN_EXP),
  SENDER_EMAIL,
  SENDGRID_API_KEY,
  TOKEN_PRIVATE_KEY,
  TOKEN_PUBLIC_KEY
};

export default environment;
