// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const quizSchema = Type.Object(
  {
    id: Type.Number(),
    modules_id: Type.Number(),
    type: Type.String(),
    question: Type.String(),
    media_id: Type.String(),
    answer_type: Type.String(),
    created_by: Type.Number(),
    created_date: Type.String({ format: 'date-time' }),
    updated_date: Type.String({ format: 'date-time' }),
    is_deleted: Type.Number()
  }
)
export const quizValidator = getValidator(quizSchema, dataValidator)
export const quizResolver = resolve({})

export const quizExternalResolver = resolve({})

// Schema for creating new entries
// media_id dijadikan optional karena chat bisa dimulai tanpa media (voice/text)
export const quizDataSchema = Type.Object(
  {
    modules_id: Type.Number(),
    question: Type.String(),
    media_id: Type.Optional(Type.String()),
    created_by: Type.Number()
  },
  { $id: 'QuizData', additionalProperties: false }
)


export const quizDataValidator = getValidator(quizDataSchema, dataValidator)
export const quizDataResolver = resolve({
  created_date: async () => new Date().toLocaleString('sv-SE')
})

// Schema for updating existing entries
export const quizPatchSchema = Type.Partial(quizSchema, {
  $id: 'QuizPatch'
})
export const quizPatchValidator = getValidator(quizPatchSchema, dataValidator)
export const quizPatchResolver = resolve({
  updated_date: async () => new Date().toLocaleString('sv-SE')
})

// Schema for allowed query properties
export const quizQueryProperties = Type.Pick(quizSchema, ['id', 'modules_id','type','question','media_id','answer_type','created_by','is_deleted'])
export const quizQuerySchema = Type.Intersect(
  [
    querySyntax(quizQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const quizQueryValidator = getValidator(quizQuerySchema, queryValidator)
export const quizQueryResolver = resolve({})
