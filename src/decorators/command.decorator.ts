import { Reflection as Reflect } from '@abraham/reflection';
import { Constructor } from '../../utils/interfaces/constructor.interface';
import { ClassDecorator } from '../../utils/types/class-decorator.type';
import { Parameter } from '../interfaces/parameter.interface';

interface Data {
  signature: string;
  parameters?: Record<string, Parameter>;
}

export const Command = (data: Data): ClassDecorator => {
  return (target: Constructor) => {
    const { signature, parameters } = data;

    Reflect.defineMetadata('signature', signature, target);
    Reflect.defineMetadata('parameters', parameters, target);

    return target;
  };
};
