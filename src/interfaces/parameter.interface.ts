export interface Parameter {
  type: 'string' | 'boolean';
  short?: string;
  multiple?: boolean;
  default?: string | boolean;
}
