import { Reflection as Reflect } from '@abraham/reflection';
import { Constructor } from '../interfaces/constructor.interface';
import { Parameter } from '../interfaces/parameter.interface';
import { ClassDecorator } from '../types/class-decorator.type';

interface Data {
  signature: string;
  signatures?: string[];
  parameters?: Record<string, Parameter>;
  global?: boolean;
}

export const Command = (data: Data): ClassDecorator => {
  return (target: Constructor) => {
    const { signature, signatures, parameters } = data;

    Reflect.defineMetadata('signature', signature, target);
    Reflect.defineMetadata('signatures', signatures, target);
    Reflect.defineMetadata('parameters', parameters, target);

    return target;
  };
};
