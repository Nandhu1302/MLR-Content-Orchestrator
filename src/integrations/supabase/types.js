export const Json = {
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  null: null,
  object: (key) => ({ [key]: Json }),
  array: () => []
};