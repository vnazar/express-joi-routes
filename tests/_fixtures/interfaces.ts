import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';

export interface BodySchema<T> extends ValidatedRequestSchema {
  [ContainerTypes.Body]: T;
}

export interface QuerySchema<T> extends ValidatedRequestSchema {
  [ContainerTypes.Query]: T;
}

export interface PostOneSchema {
  attrA: string;
  attrB: string;
}

export interface GetOneSchema {
  attrA: string;
  attrB: string;
}
