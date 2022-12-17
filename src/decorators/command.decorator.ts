import { Reflection as Reflect } from '@abraham/reflection';
import { Constructor } from '../interfaces/constructor.interface';
import { Parameter } from '../interfaces/parameter.interface';
import { ClassDecorator } from '../types/class-decorator.type';

interface Data {
  signature: string;
  parameters?: Record<string, Parameter>;
  global?: boolean;
}

export const Command = (data: Data): ClassDecorator => {
  return (target: Constructor) => {
    const { signature, parameters, global } = data;

    Reflect.defineMetadata('signature', signature, target);
    Reflect.defineMetadata('parameters', parameters, target);
    Reflect.defineMetadata('global', global, target);

    return target;
  };
};
