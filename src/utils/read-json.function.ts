import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export const readJson = async <T = Record<string, any>>(path: string): Promise<T> => {
  if (!existsSync(path)) {
    throw new Error(`JSON file ${resolve(path)} does not exist`);
  }

  const content = await readFile(resolve(path));

  return JSON.parse(content.toString());
};
