import chalk from 'chalk';
import { paramCase, pascalCase } from 'change-case';
import { pluralize, singularize } from 'inflection';
import { Command } from '../decorators/command.decorator';
import { logError } from '../utils/log-error.function';
import { logInfo } from '../utils/log-info.function';
import { publishStub } from '../utils/publish-stub.function';

@Command({
  signature: 'make',
  parameters: {
    fileType: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    help: {
      type: 'boolean',
      short: 'h',
      default: false,
    },
  },
})
export class MakeCommand {
  public async handle(fileType: string, name: string, flags: Record<string, boolean>): Promise<void> {
    const cwd = process.cwd();

    const usageInfo = `Usage: ${chalk.gray('$')} ${chalk.white('northle make')} ${chalk.gray('<file-type>')} ${chalk.gray('<name>')}\n`;

    if (flags.help || !fileType) {
      logInfo(usageInfo);

      logInfo('Available options:\n');

      console.table({
        channel: 'Create new WebSocket channel',
        controller: 'Create new controller',
        middleware: 'Create new HTTP middleware',
        module: 'Create new application module',
      });

      return;
    }

    if (!name) {
      logError('The name argument is required');

      return;
    }

    let subfolder = '';

    if (name.includes('/')) {
      subfolder = name.slice(0, name.lastIndexOf('/'));

      name = name.split('/').pop()!;
    }

    switch (fileType) {
      case 'controller': {
        const className = `${pascalCase(singularize(name))}Controller`;

        const path = `src/${
          subfolder ? subfolder : paramCase(pluralize(name))
        }/${paramCase(singularize(name))}.controller.ts`;

        const fullPath = `${cwd}/${path}`;

        await publishStub(fullPath, 'controller', {
          className,
          path: paramCase(pluralize(name)),
          view: paramCase(pluralize(name)),
        });

        logInfo(
          `Created ${fileType} '${className}' ${chalk.gray('[')}${chalk.white(
            path,
          )}${chalk.gray(']')}`,
        );

        break;
      }

      case 'middleware': {
        const className = `${pascalCase(singularize(name))}Middleware`;

        const path = `src/${
          subfolder ? subfolder : paramCase(pluralize(name))
        }/${paramCase(singularize(name))}.middleware.ts`;

        const fullPath = `${cwd}/${path}`;

        await publishStub(fullPath, 'middleware', {
          className,
        });

        logInfo(
          `Created ${fileType} '${className}' ${chalk.gray('[')}${chalk.white(
            path,
          )}${chalk.gray(']')}`,
        );

        break;
      }

      default: {
        logError(`Unknown file type '${fileType}'`);

        process.exit(1);
      }
    }
  }
}
