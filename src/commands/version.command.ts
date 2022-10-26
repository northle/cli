import { logInfo } from '../utils/log-info.function';
import { readJson } from '../utils/read-json.function';
import { Command } from '../decorators/command.decorator';

@Command({
  signature: 'version',
})
export class VersionCommand {
  public async handle(): Promise<void> {
    const { version } = await readJson('package.json');

    logInfo(`Northle CLI v${version}`);
  }
}
