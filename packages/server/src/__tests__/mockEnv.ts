import fs from 'fs';

import env from './__mocks__/env';

const { existsSync, readFileSync } = fs;

const { cwd } = process;

interface Env {
  [key: string]: string | number | boolean;
}

const parseEnvFile = (): Env => {
  const path = `${cwd()}/.env`;
  if (!existsSync(path)) {
    return env as Env;
  }

  try {
    const envFileContent = readFileSync(path, 'utf8');

    return envFileContent.split(/\n/).reduce((acc: Env, entry) => {
      const index = entry.split('').findIndex(letter => letter === '=');

      if (index >= 0) {
        const key = entry.slice(0, index);
        const originValue = entry.slice(index + 1);
        let value;

        switch (true) {
          case !isNaN(Number(originValue)):
            value = Number(originValue);
            break;
          case originValue === 'true' || originValue === 'false':
            value = Boolean(originValue);
            break;
          default:
            value = originValue;
        }

        return { ...acc, [key]: value };
      }

      return acc;
    }, {});
  } catch (error) {
    console.error(error);
  }

  return {};
};

export default parseEnvFile;
