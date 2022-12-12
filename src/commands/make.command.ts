import { Command } from '../decorators/command.decorator';
import { logError } from '../utils/log-error.function';
import { logInfo } from '../utils/log-info.function';
import { publishStub } from '../utils/publish-stub.function';
import { pluralize, singularize } from 'inflection';
import { paramCase, pascalCase } from 'change-case';
import chalk from 'chalk';

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
  public async handle(fileType: string, name: string, help: boolean): Promise<void> {
    const cwd = process.cwd();

    if (help) {
      logInfo(`Usage: northle make ${fileType ?? '<file-type>'} <name>`);

      return;
    }

    if (!name) {
      logError('The name argument is required');

      return;
    }

    switch (fileType) {
      case 'controller': {
        const className = `${pascalCase(singularize(name))}Controller`;
        const path = `src/${paramCase(pluralize(name))}/${paramCase(singularize(name))}.controller.ts`;
        const fullPath = `${cwd}/${path}`;

        await publishStub(fullPath, 'controller', {
          className,
          path: paramCase(pluralize(name)),
          view: paramCase(pluralize(name)),
        });

        logInfo(`Created ${fileType} '${className}' ${chalk.gray('[')}${chalk.white(path)}${chalk.gray(']')}`);

        break;
      }

      case 'middleware': {
        const className = `${pascalCase(singularize(name))}Middleware`;
        const path = `src/${paramCase(pluralize(name))}/${paramCase(singularize(name))}.middleware.ts`;
        const fullPath = `${cwd}/${path}`;

        await publishStub(fullPath, 'middleware', {
          className,
        });

        logInfo(`Created ${fileType} '${className}' ${chalk.gray('[')}${chalk.white(path)}${chalk.gray(']')}`);

        break;
      }

      default: {
        logError(`Unknown file type '${fileType}'`);

        process.exit(1);
      }
    }
  }
}
