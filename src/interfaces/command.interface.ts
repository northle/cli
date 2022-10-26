export interface Command {
  handle(...params: unknown[]): Promise<void>;
}
