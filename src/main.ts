import { Reflection as Reflect } from '@abraham/reflection';
import { parseArgs } from 'node:util';
import { existsSync } from 'node:fs';
import { MakeCommand } from './commands/make.command';
import { NewCommand } from './commands/new.command';
import { VersionCommand } from './commands/version.command';
import { UpdateCommand } from './commands/update.command';
import { Command } from './interfaces/command.interface';
import { Constructor } from './interfaces/constructor.interface';
import { Parameter } from './interfaces/parameter.interface';
import { logError } from './utils/log-error.function';

process.on('uncaughtException', (error: Error) => {
  logError(error.message);

  process.exit(1);
});

const commands: Constructor<Command>[] = [MakeCommand, NewCommand, UpdateCommand, VersionCommand];

let isCommandValid = false;

await Promise.all(
  commands.map(async (command: Constructor<Command>) => {
    const name = Reflect.getMetadata('signature', command);

    if (name === process.argv[2]) {
      const requiredArguments: Record<string, Parameter> =
        Reflect.getMetadata('parameters', command) ?? {};

      if (!Reflect.getMetadata('global', command) && !existsSync(`${process.cwd()}/package.json`)) {
        logError(`Command '${name}' can only be used in a Northle app directories`);

        process.exit(1);
      }

      const { values, positionals } = parseArgs({
        args: process.argv.slice(3),
        options: {
          ...requiredArguments,
        },
        allowPositionals: true,
        strict: false,
      });

      const instance: Command = new command();

      const requiredPositionals = Object.values(requiredArguments).filter(
        (parameter) => parameter.type === 'string',
      );

      const resolvedPositionals = new Array(requiredPositionals.length);

      positionals.map((positional, index) => {
        resolvedPositionals[index] = positional;
      });

      resolvedPositionals.fill(undefined, positionals.length);

      try {
        await instance.handle(...resolvedPositionals, values);
      } catch (error) {
        logError((error as Error).message);

        process.exit(1);
      }

      isCommandValid = true;

      return;
    }
  }),
);

if (!isCommandValid) {
  logError(`Unknown command '${process.argv[2]}'`);
}
