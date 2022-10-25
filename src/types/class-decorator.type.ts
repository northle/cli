import { Constructor } from '../interfaces/constructor.interface';

export type ClassDecorator<T extends Function = any> = (
  target: Constructor<T>,
) => T | void;
