import { KnexService } from '@feathersjs/knex'

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class QuizService extends KnexService {
  async create(data, params) {
    // Opsi 1: assignment guru least-loaded saat santri mulai chat
    if (data.instructor_id == null) {
      try {
        const knex = this.Model
        // ambil daftar guru dari profiles (user_role = 'guru')
        const guruList = await knex('profiles')
          .join('users', 'profiles.user_id', 'users.id')
          .where('users.role', 'guru')
          .select('profiles.user_id as guru_id')

        if (guruList.length > 0) {
          // hitung chat aktif per guru (thread quiz dengan instructor_id = guru)
          const counts = await knex('quiz')
            .whereIn('instructor_id', guruList.map(g => g.guru_id))
            .where('is_completed', 0)
            .where('is_deleted', 0)
            .groupBy('instructor_id')
            .select('instructor_id')
            .count('* as total')

          const countMap = {}
          counts.forEach(c => { countMap[c.instructor_id] = parseInt(c.total) })

          // pilih guru dengan beban tersedikit
          let picked = guruList[0].guru_id
          let min = Infinity
          for (const g of guruList) {
            const load = countMap[g.guru_id] || 0
            if (load < min) {
              min = load
              picked = g.guru_id
            }
          }
          data.instructor_id = picked
        }
      } catch (err) {
        console.error('Gagal assign guru (least-loaded):', err.message)
        // biarkan null, guru mengambil manual nanti
      }
    }
    return super.create(data, params)
  }
}

export const getOptions = app => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresql'),
    name: 'quiz'
  }
}
