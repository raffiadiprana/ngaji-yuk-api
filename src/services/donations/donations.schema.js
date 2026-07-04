import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main schema
export const donationsSchema = Type.Object(
  {
    id: Type.Number(),
    user_id: Type.Number(),
    account_name: Type.String(),
    bank_name: Type.String(),
    source_bank: Type.String(),
    amount: Type.Number(),
    proof_image: Type.String(),
    is_verified: Type.Number(),
    created_at: Type.Optional(Type.String({ format: 'date-time' })),
    reject_reason: Type.Optional(Type.String())
  },
  { $id: 'Donations', additionalProperties: false }
)

export const donationsValidator = getValidator(donationsSchema, dataValidator)
export const donationsResolver = resolve({})

export const donationsExternalResolver = resolve({})

// Create schema
export const donationsDataSchema = Type.Pick(donationsSchema, [
  'user_id',
  'account_name',
  'bank_name',
  'source_bank',
  'amount',
  'proof_image',
  'is_verified',
  'reject_reason'
], {
  $id: 'DonationsData'
})

export const donationsDataValidator = getValidator(donationsDataSchema, dataValidator)
export const donationsDataResolver = resolve({
  created_at: async () => new Date().toLocaleString('sv-SE')
})

// Patch schema
export const donationsPatchSchema = Type.Partial(donationsSchema, {
  $id: 'DonationsPatch'
})
export const donationsPatchValidator = getValidator(donationsPatchSchema, dataValidator)
export const donationsPatchResolver = resolve({})

// Query schema
export const donationsQueryProperties = Type.Pick(donationsSchema, [
  'id',
  'user_id',
  'account_name',
  'bank_name',
  'source_bank',
  'is_verified',
  'created_at'
])
export const donationsQuerySchema = Type.Intersect([
  querySyntax(donationsQueryProperties),
  Type.Object({}, { additionalProperties: false })
], {
  additionalProperties: false
})

export const donationsQueryValidator = getValidator(donationsQuerySchema, queryValidator)
export const donationsQueryResolver = resolve({})
