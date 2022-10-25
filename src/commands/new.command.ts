import { logInfo } from '../utils/log-info.function';
import { runCommand } from '../utils/run-command.function';
import { Command } from '../decorators/command.decorator';

@Command({
  signature: 'new',
})
export class NewCommand {
  public async handle(projectName: string): Promise<void> {
    logInfo('Running database migrations...');

    runCommand(`npm create @northle ${projectName}`, { showOutput: true });
  }
}
