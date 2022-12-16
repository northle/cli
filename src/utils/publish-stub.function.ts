import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { makeFile } from './make-file.function';

export const publishStub = async (
  file: string,
  stub: string,
  data: Record<string, string>,
  options?: { force?: boolean },
) => {
  try {
    const path = `${fileURLToPath(import.meta.url)}/../../../stubs/${stub}.stub`;

    let content = (await readFile(path)).toString();

    for (const expression of content.matchAll(/\{\{(@?)(.*?)\}\}/g) ?? []) {
      const value = data[expression[2].trim()] ?? '';

      content = content.replace(expression[0], value);
    }

    return await makeFile(file, content, {
      force: options?.force ?? false,
    });
  } catch (error) {
    return false;
  }
};
