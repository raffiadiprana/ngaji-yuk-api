import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

export const userProgressSchema = Type.Object(
  {
    id: Type.Number(),
    user_id: Type.Number(),
    module_id: Type.Number(),
    status: Type.String(),
    progress_percent: Type.Number(),
    created_date: Type.String({ format: 'date-time' }),
    updated_date: Type.String({ format: 'date-time' })
  },
  { $id: 'UserProgress' }
)
export const userProgressValidator = getValidator(userProgressSchema, dataValidator)
export const userProgressResolver = resolve({})

export const userProgressExternalResolver = resolve({})

export const userProgressDataSchema = Type.Pick(userProgressSchema, [
  'user_id',
  'module_id',
  'status',
  'progress_percent'
], { $id: 'UserProgressData' })

export const userProgressDataValidator = getValidator(userProgressDataSchema, dataValidator)
export const userProgressDataResolver = resolve({
  created_date: async () => new Date().toLocaleString('sv-SE')
})

export const userProgressPatchSchema = Type.Partial(userProgressSchema, {
  $id: 'UserProgressPatch'
})
export const userProgressPatchValidator = getValidator(userProgressPatchSchema, dataValidator)
export const userProgressPatchResolver = resolve({
  updated_date: async () => new Date().toLocaleString('sv-SE')
})

export const userProgressQueryProperties = Type.Pick(userProgressSchema, [
  'id', 'user_id', 'module_id', 'status'
])
export const userProgressQuerySchema = Type.Intersect(
  [
    querySyntax(userProgressQueryProperties),
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const userProgressQueryValidator = getValidator(userProgressQuerySchema, queryValidator)
export const userProgressQueryResolver = resolve({})
