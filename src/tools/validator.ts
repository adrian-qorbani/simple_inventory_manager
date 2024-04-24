import Ajv, { Schema } from 'ajv';

const ajv = new Ajv();

export function validateSchema(schema: Schema | object, body: any): boolean {
  const validate = ajv.compile(schema);
  return validate(body);
}