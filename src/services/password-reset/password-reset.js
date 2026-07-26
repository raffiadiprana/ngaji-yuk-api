// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import bcrypt from 'bcryptjs'

const passwordResetPath = 'password-reset'
const passwordResetMethods = ['create']

// Service reset password tanpa auth: cari user by email, hash bcrypt, update langsung.
export class PasswordReset {
  constructor (options, app) {
    this.options = options
    this.app = app
  }

  async create (data, params) {
    const { email, newPassword } = data || {}

    if (!email || !newPassword) {
      throw new Error('Email dan password baru wajib diisi')
    }
    if (String(newPassword).length < 6) {
      throw new Error('Password baru minimal 6 karakter')
    }

    const userModel = this.app.service('users').Model
    const found = await userModel.query().whereILike('email', email).limit(1)

    if (!found || found.length === 0) {
      // Pesan generik agar tidak membocorkan akun ada/tidak
      return { message: 'Jika email terdaftar, password berhasil direset.' }
    }

    const hash = await bcrypt.hash(String(newPassword), 10)
    await userModel.query().where('id', found[0].id).update({ password: hash })

    return { message: 'Jika email terdaftar, password berhasil direset.' }
  }
}

export const passwordReset = app => {
  app.use(passwordResetPath, new PasswordReset({}, app), {
    methods: passwordResetMethods,
    events: []
  })

  app.service(passwordResetPath).hooks({
    around: {
      all: []
    },
    before: {
      all: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
