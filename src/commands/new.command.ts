import { Command } from '../decorators/command.decorator';
import { logInfo } from '../utils/log-info.function';
import { runCommand } from '../utils/run-command.function';

@Command({
  signatures: ['new', 'n'],
  parameters: {
    projectName: {
      type: 'string',
    },
  },
  global: true,
})
export class NewCommand {
  public async handle(projectName: string): Promise<void> {
    logInfo('Running database migrations...');

    runCommand(`npm create @northle ${projectName}`, { showOutput: true });
  }
}
