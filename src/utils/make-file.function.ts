import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { logError } from './log-error.function';

export const makeFile = async (
  path: string,
  content: string,
  options?: { force?: boolean },
) => {
  if (!existsSync(dirname(path))) {
    await mkdir(dirname(path), {
      recursive: true,
    });
  }

  try {
    if (!options?.force && existsSync(path)) {
      return false;
    }

    await writeFile(path, content, 'utf8');

    return true;
  } catch (error) {
    logError((error as Error).message);

    return false;
  }
};
