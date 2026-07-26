// Schema longgar untuk password-reset (tidak butuh auth)
export const passwordResetSchema = {
  $id: 'PasswordReset',
  type: 'object',
  additionalProperties: true
}

export const passwordResetResolver = {
  // jangan kembalikan apa pun yang sensitif
}
