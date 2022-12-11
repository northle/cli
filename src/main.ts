import { Reflection as Reflect } from '@abraham/reflection';
import { parseArgs } from 'node:util';
import { NewCommand } from './commands/new.command';
import { VersionCommand } from './commands/version.command';
import { Command } from './interfaces/command.interface';
import { Constructor } from './interfaces/constructor.interface';
import { Parameter } from './interfaces/parameter.interface';
import { logError } from './utils/log-error.function';

process.on('uncaughtException', (error: Error) => {
  logError(error.message);

  process.exit(1);
});

const commands: Constructor<Command>[] = [NewCommand, VersionCommand];

let isCommandValid = false;

await Promise.all(
  commands.map(async (command: Constructor<Command>) => {
    const name = Reflect.getMetadata('signature', command);

    if (name === process.argv[2]) {
      const requiredArguments: Record<string, Parameter> =
        Reflect.getMetadata('parameters', command) ?? {};

      const argumentValues = parseArgs({
        args: process.argv.slice(3),
        options: {
          ...requiredArguments,
        },
        strict: false,
      }).values;

      const instance: Command = new command();

      try {
        await instance.handle(...Object.values(argumentValues));
      } catch (err) {
        logError((err as Error).message);

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
