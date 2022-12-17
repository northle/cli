import chalk from 'chalk';
import { Command } from '../decorators/command.decorator';
import { logInfo } from '../utils/log-info.function';
import { readJson } from '../utils/read-json.function';
import { runCommand } from '../utils/run-command.function';

@Command({
  signature: 'update',
})
export class UpdateCommand {
  public async handle(): Promise<void> {
    const { dependencies } = await readJson<Record<string, string | string[]>>(
      `${process.cwd()}/package.json`,
    );

    const oldVersions = new Map<string, string>();

    for (const dependency of Object.keys(dependencies)) {
      if (dependency.startsWith('@northle')) {
        oldVersions.set(
          dependency,
          (dependencies[dependency as any] as string).replace(/[\^~]/, ''),
        );

        logInfo(`Updating ${chalk.white(dependency)} package...`);

        runCommand(`npm install ${dependency}@latest`);
      }
    }

    const data = await readJson<Record<string, string | string[]>>(
      `${process.cwd()}/package.json`,
    );

    logInfo(
      `Northle has been updated ${chalk.gray(
        `[${[...oldVersions]
          .map(
            (name, version) =>
              `${name}: ${version} -> ${data.dependencies[name as any].replace(
                /[\^~]/,
                '',
              )}`,
          )
          .join(', ')}]`,
      )}`,
    );
  }
}
