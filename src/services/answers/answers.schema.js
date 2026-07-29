// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const answersSchema = Type.Object(
  {
    id: Type.Number(),
    quiz_id: Type.Number(),
    user_id: Type.Number(),
    instructor_id: Type.Number(),
    reply_to: Type.Number(),
    answer_type: Type.String(),
    answer_value: Type.String(),
    checked_by: Type.Number(),
    is_passed: Type.Number(),
    score: Type.Number(),
    review_notes: Type.String(),
    created_date: Type.String({ format: 'date-time' }),
    updated_date: Type.String({ format: 'date-time' })
  }
)
export const answersValidator = getValidator(answersSchema, dataValidator)
export const answersResolver = resolve({})

export const answersExternalResolver = resolve({})

// Schema for creating new entries
// instructor_id & reply_to dihapus dari required karena kolom tidak ada di tabel answers (DB)
export const answersDataSchema = Type.Pick(answersSchema, [
  'quiz_id',
  'user_id',
  'answer_type',
  'answer_value',
  'is_passed',
  'score',
  'review_notes'
])

export const answersDataValidator = getValidator(answersDataSchema, dataValidator)
export const answersDataResolver = resolve({
  created_date: async () => new Date().toLocaleString('sv-SE')
})

// Schema for updating existing entries
export const answersPatchSchema = Type.Partial(answersSchema, {
  $id: 'AnswersPatch'
})
export const answersPatchValidator = getValidator(answersPatchSchema, dataValidator)
export const answersPatchResolver = resolve({
  updated_date: async () => new Date().toLocaleString('sv-SE')
})

// Schema for allowed query properties
export const answersQueryProperties = Type.Pick(answersSchema, ['id', 'quiz_id','user_id','instructor_id','reply_to','is_passed','created_date'])

export const answersQuerySchema = Type.Intersect(
  [
    querySyntax(answersQueryProperties),
    // Relaxed to accept Feathers nested query operators like `$or`
    Type.Object({
      '$or': Type.Array(Type.Any()),
      '$and': Type.Array(Type.Any()),
      '$nor': Type.Array(Type.Any())
    }, { additionalProperties: true })
  ],
  { additionalProperties: true }
)
export const answersQueryValidator = getValidator(answersQuerySchema, queryValidator)
export const answersQueryResolver = resolve({})
