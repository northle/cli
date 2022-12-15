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
    exact: {
      type: 'boolean',
      short: 'e',
      default: false,
    },
    force: {
      type: 'boolean',
      short: 'f',
      default: false,
    },
  },
})
export class MakeCommand {
  public async handle(
    fileType: string,
    name: string,
    flags: Record<string, boolean>,
  ): Promise<void> {
    const cwd = process.cwd();

    if (flags.help || !fileType) {
      logInfo(`Usage: ${chalk.gray('$')} ${chalk.white(
        'northle make',
      )} ${chalk.gray('<file-type>')} ${chalk.gray('<name>')}\n`);

      logInfo('Available options:\n');

      console.table([
        {
          type: 'channel',
          description: 'Create new WebSocket channel',
        },
        {
          type: 'controller',
          description: 'Create new controller',
        },
        {
          type: 'middleware',
          description: 'Create new HTTP middleware',
        },
        {
          type: 'module',
          description: 'Create new application module',
        },
      ]);

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
        const className = `${flags.exact ? name : pascalCase(singularize(name))}Controller`;

        const resolvedName = flags.exact ? name : paramCase(pluralize(name));

        const path = `src/${
          subfolder ? subfolder : resolvedName
        }/${flags.exact ? name : paramCase(singularize(name))}.controller.ts`;

        const fullPath = `${cwd}/${path}`;

        await publishStub(fullPath, 'controller', {
          className,
          path: resolvedName,
          view: resolvedName,
        }, {
          force: flags.force,
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

        const resolvedName = flags.exact ? name : paramCase(pluralize(name));

        const path = `src/${
          subfolder ? subfolder : resolvedName
        }/${flags.exact ? name : paramCase(singularize(name))}.middleware.ts`;

        const fullPath = `${cwd}/${path}`;

        await publishStub(fullPath, 'middleware', {
          className,
        }, {
          force: flags.force,
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
