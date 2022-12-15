import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export const makeFile = async (path: string, content: string, options?: { force?: boolean }) => {
  if (!existsSync(path)) {
    await mkdir(dirname(path), {
      recursive: true,
    });
  } else {
    return false;
  }

  try {
    if (!(options?.force ?? false) && existsSync(path)) {
      return false;
    }

    await writeFile(path, content, 'utf8');

    return true;
  } catch (error) {
    return false;
  }
};
