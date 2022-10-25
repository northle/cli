import { Reflection as Reflect } from '@abraham/reflection';
import { parseArgs } from 'node:util';
import { logError } from './utils/log-error.function';
import { Constructor } from './interfaces/constructor.interface';
import { Command } from './interfaces/command.interface';
import { Parameter } from './interfaces/parameter.interface';
import { NewCommand } from './commands/new.command';

process.on('uncaughtException', (err: Error) => {
  logError(err.message);

  process.exit(1);
});

const commands: Constructor<Command>[] = [
  NewCommand,
];

let isCommandValid = false;

await Promise.all(
  commands.map(async (command: Constructor<Command>) => {
    const name = Reflect.getMetadata('signature', command);

    const requiredArguments: Record<string, Parameter> =
      Reflect.getMetadata('parameters', command) ?? {};

    const { values, positionals } = parseArgs({
      args: process.argv.slice(2),
      options: {
        cmd: {
          type: 'string',
        },
        ...requiredArguments,
      },
      allowPositionals: true,
    });

    if (name === positionals[0]) {
      const instance: Command = new command();

      try {
        await instance.handle(values);
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
