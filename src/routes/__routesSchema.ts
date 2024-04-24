// Schema for AJV Validation
export const createCategorySchema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
    required: ['name'],
    additionalProperties: false,
  };
  
  export const updateCategoryCounterSchema = {
    type: 'object',
    properties: {
      categoryName: { type: 'string' },
      action: { type: 'string', enum: ['increase', 'decrease'] },
      amount: { type: 'number' },
    },
    required: ['categoryName', 'action', 'amount'],
    additionalProperties: false,
  };