// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const modulesSchema = Type.Object(
  {
    id: Type.Number(),
    title: Type.String(),
    description: Type.String(),
    video_header_id: Type.String(),
    thumbnail: Type.String(),
    section_id: Type.Number(),
    instructor_id: Type.Number(),
    category: Type.String(),
    order_index: Type.Number(),
    created_date: Type.String({ format: 'date-time' }),
    updated_date: Type.String({ format: 'date-time' }),
    is_deleted: Type.Number(),
    arabic_text: Type.String(),
    transliteration: Type.String(),
    meaning: Type.String(),
    ghunnah: Type.Boolean(),
    duration: Type.Number(),
    is_draft: Type.Number()
  },
  { $id: 'Modules', additionalProperties: false }
)
export const modulesValidator = getValidator(modulesSchema, dataValidator)
export const modulesResolver = resolve({})

export const modulesExternalResolver = resolve({})

// Schema for creating new entries
export const modulesDataSchema = Type.Pick(modulesSchema, [
  'title',
  'description',
  'video_header_id',
  'thumbnail',
  'section_id',
  'instructor_id',
  'category',
  'order_index',
  'arabic_text',
  'transliteration',
  'meaning',
  'ghunnah',
  'duration',
  'is_draft'
], { $id: 'ModulesData' })


export const modulesDataValidator = getValidator(modulesDataSchema, dataValidator)
export const modulesDataResolver = resolve({
  created_date: async () => new Date().toLocaleString('sv-SE')
})

// Schema for updating existing entries
export const modulesPatchSchema = Type.Partial(modulesSchema, {
  $id: 'ModulesPatch'
})
export const modulesPatchValidator = getValidator(modulesPatchSchema, dataValidator)
export const modulesPatchResolver = resolve({
  updated_date: async () => new Date().toLocaleString('sv-SE')
})

// Schema for allowed query properties
export const modulesQueryProperties = Type.Pick(modulesSchema, ['id', 'section_id','instructor_id','category','order_index','is_deleted'])
export const modulesQuerySchema = Type.Intersect(
  [
    querySyntax(modulesQueryProperties),
    // Add additional query properties here
    
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const modulesQueryValidator = getValidator(modulesQuerySchema, queryValidator)
export const modulesQueryResolver = resolve({})
