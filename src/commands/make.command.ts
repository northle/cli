import chalk from 'chalk';
import { capitalCase, paramCase, pascalCase } from 'change-case';
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
    const { force, help } = flags;

    if (help || !fileType) {
      logInfo(
        `Usage: ${chalk.gray('$')} ${chalk.white('northle make')} ${chalk.gray(
          '<file-type>',
        )} ${chalk.gray('<name>')}\n`,
      );

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
          type: 'email',
          description: 'Create new email template',
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

    let created = false;
    let createdName = '';
    let createdPath = '';
    let directory = '';

    if (name.includes('/')) {
      directory = name.slice(0, name.lastIndexOf('/'));

      name = name.split('/').pop()!;
    }

    switch (fileType) {
      case 'channel': {
        const className = `${
          flags.exact ? name : pascalCase(singularize(name))
        }Channel`;
        const resolvedName = flags.exact ? name : paramCase(pluralize(name));

        const path = `src/${
          directory ? directory : paramCase(resolvedName)
        }/${paramCase(flags.exact ? name : singularize(name))}.channel.ts`;

        const fullPath = `${cwd}/${path}`;

        created = await publishStub(
          fullPath,
          'channel',
          {
            className,
            path: resolvedName,
          },
          {
            force,
          },
        );

        createdName = className;
        createdPath = path;

        break;
      }

      case 'controller': {
        const className = `${
          flags.exact ? name : pascalCase(singularize(name))
        }Controller`;
        const resolvedName = flags.exact ? name : paramCase(pluralize(name));

        const path = `src/${
          directory ? directory : paramCase(resolvedName)
        }/${paramCase(flags.exact ? name : singularize(name))}.controller.ts`;

        const fullPath = `${cwd}/${path}`;

        created = await publishStub(
          fullPath,
          'controller',
          {
            className,
            path: resolvedName,
            view: resolvedName,
          },
          {
            force,
          },
        );

        createdName = className;
        createdPath = path;

        break;
      }

      case 'email': {
        const resolvedName = paramCase(name);
        const path = `src/${directory ? directory : 'emails'}/views/${paramCase(
          resolvedName,
        )}.html`;
        const fullPath = `${cwd}/${path}`;

        created = await publishStub(
          fullPath,
          'email',
          {
            title: capitalCase(name),
          },
          {
            force,
          },
        );

        createdName = resolvedName;
        createdPath = path;

        break;
      }

      case 'middleware': {
        const className = `${pascalCase(singularize(name))}Middleware`;
        const resolvedName = flags.exact ? name : paramCase(pluralize(name));

        const path = `src/${
          directory ? directory : paramCase(resolvedName)
        }/${paramCase(flags.exact ? name : singularize(name))}.middleware.ts`;

        const fullPath = `${cwd}/${path}`;

        created = await publishStub(
          fullPath,
          'middleware',
          {
            className,
          },
          {
            force,
          },
        );

        createdName = className;
        createdPath = path;

        break;
      }

      case 'module': {
        const className = `${
          flags.exact ? name : pascalCase(singularize(name))
        }Module`;
        const resolvedName = flags.exact ? name : paramCase(pluralize(name));

        const path = `src/${
          directory ? directory : paramCase(resolvedName)
        }/${paramCase(flags.exact ? name : singularize(name))}.module.ts`;

        const fullPath = `${cwd}/${path}`;

        created = await publishStub(
          fullPath,
          'module',
          {
            className,
          },
          {
            force,
          },
        );

        createdName = className;
        createdPath = path;

        break;
      }

      case 'service': {
        const className = `${
          flags.exact ? name : pascalCase(singularize(name))
        }Service`;
        const resolvedName = flags.exact ? name : paramCase(pluralize(name));

        const path = `src/${
          directory ? directory : paramCase(resolvedName)
        }/${paramCase(flags.exact ? name : singularize(name))}.service.ts`;

        const fullPath = `${cwd}/${path}`;

        created = await publishStub(
          fullPath,
          'service',
          {
            className,
            path: resolvedName,
          },
          {
            force,
          },
        );

        createdName = className;
        createdPath = path;

        break;
      }

      case 'test': {
        const resolvedName = flags.exact ? name : paramCase(pluralize(name));

        const path = `src/${
          directory ? directory : paramCase(resolvedName)
        }/${paramCase(flags.exact ? name : singularize(name))}.test.ts`;

        const fullPath = `${cwd}/${path}`;

        created = await publishStub(
          fullPath,
          'test',
          {
            describe: name,
            it: `has working ${name} features`,
          },
          {
            force,
          },
        );

        createdName = resolvedName;
        createdPath = path;

        break;
      }

      default: {
        logError(`Unknown file type '${fileType}'`);

        process.exit(1);
      }
    }

    if (!created) {
      logError(
        `${fileType[0].toUpperCase()}${fileType.slice(
          1,
        )} '${name}' already exists. Use the --force flag to overwrite it.`,
      );

      return;
    }

    logInfo(
      `Created ${fileType} '${createdName}' ${chalk.gray('[')}${chalk.white(
        createdPath,
      )}${chalk.gray(']')}`,
    );
  }
}
