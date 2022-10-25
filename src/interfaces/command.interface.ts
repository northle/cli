interface Arguments {
  [x: string]: string | boolean | (string | boolean)[] | undefined;
}

export interface Command {
  handle(params: Arguments): Promise<void>;
}
