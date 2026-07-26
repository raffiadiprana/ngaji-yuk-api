import { Service } from 'feathers'

// Service reset password tanpa auth: cari user by email, hash bcrypt, update langsung.
export class PasswordReset extends Service {
  async create (data, params) {
    const { email, newPassword } = data || {}

    if (!email || !newPassword) {
      throw new Error("Email dan password baru wajib diisi")
    }
    if (String(newPassword).length < 6) {
      throw new Error("Password baru minimal 6 karakter")
    }

    const userModel = this.Model // Model knex dari users service
    const found = await userModel.query().whereILike('email', email).limit(1)

    if (!found || found.length === 0) {
      // Pesan generik agar tidak membocorkan akun ada/tidak
      return { message: 'Jika email terdaftar, password berhasil direset.' }
    }

    const bcrypt = await import('@feathersjs/authentication-local').then(m => m.passwordHash)
    // Kita hash manual pakai bcryptjs agar konsisten dengan strategy local
    const bcryptjs = await import('bcryptjs')
    const hash = await bcryptjs.default.hash(String(newPassword), 10)

    await userModel.query().where('id', found[0].id).update({ password: hash })

    return { message: 'Jika email terdaftar, password berhasil direset.' }
  }
}

export const getOptions = app => {
  return {
    Model: app.service('users').Model,
    paginate: false
  }
}
