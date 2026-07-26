// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import bcrypt from 'bcryptjs'

const passwordResetPath = 'password-reset'
const passwordResetMethods = ['create']

export class PasswordReset {
  constructor (options, app) {
    this.options = options
    this.app = app
  }

  async create (data, params) {
    const { email, newPassword, step } = data || {}
    const knex = this.app.get('mysqlClient')

    if (!email) {
      throw new Error('Email wajib diisi')
    }

    // Langkah 1: cek apakah email terdaftar (tanpa mengubah apa pun)
    if (step === 'check') {
      const found = await knex('users').whereILike('email', email).limit(1)
      return { exists: found.length > 0 }
    }

    // Langkah 2: reset password
    if (!newPassword) {
      throw new Error('Password baru wajib diisi')
    }
    if (String(newPassword).length < 6) {
      throw new Error('Password baru minimal 6 karakter')
    }

    const found = await knex('users').whereILike('email', email).limit(1)
    if (!found || found.length === 0) {
      return { success: false, message: 'Email tidak ditemukan dalam sistem.' }
    }

    const hash = await bcrypt.hash(String(newPassword), 10)
    await knex('users').where('id', found[0].id).update({ password: hash })

    return { success: true, message: 'Password berhasil direset. Silakan login.' }
  }
}

export const passwordReset = app => {
  app.use(passwordResetPath, new PasswordReset({}, app), {
    methods: passwordResetMethods,
    events: []
  })

  app.service(passwordResetPath).hooks({
    around: { all: [] },
    before: { all: [] },
    after: { all: [] },
    error: { all: [] }
  })
}
