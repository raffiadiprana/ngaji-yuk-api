// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  modulesDataValidator,
  modulesPatchValidator,
  modulesQueryValidator,
  modulesResolver,
  modulesExternalResolver,
  modulesDataResolver,
  modulesPatchResolver,
  modulesQueryResolver
} from './modules.schema.js'
import { ModulesService, getOptions } from './modules.class.js'
import { modulesPath, modulesMethods } from './modules.shared.js'

export * from './modules.class.js'
export * from './modules.schema.js'

import { authorize } from '../../hooks/authorize.js'

import { fastJoin, alterItems } from 'feathers-hooks-common'

const moduleResolvers = {
  instructorProfile: async (module, context) => {
    if (module.instructor_id) {
      try {
        const profileService = context.app.service('profiles');
        const profiles = await profileService.find({
          query: { user_id: module.instructor_id },
          paginate: false
        });
        module.instructor_profile = profiles[0] || null;
      } catch (error) {
        console.error('Error fetching instructor profile', error);
        module.instructor_profile = null;
      }
    }
  },
  learningStatus: async (module, context) => {
    const authUser = context.params.user
    const userId = authUser?.id || authUser?.userId || context.params.query?.user_id
    if (!userId) {
      module.is_completed = false
      module.progress_percent = 0
      module.is_locked = false
      return
    }
    const knex = context.app.get('mysqlClient')
    try {
      // cek apakah modul ini punya quiz yang is_completed=1 oleh user ini
      const quizRows = await knex('quiz')
        .where({ modules_id: module.id, created_by: userId, is_completed: 1, is_deleted: 0 })
      module.is_completed = quizRows.length > 0
      module.progress_percent = module.is_completed ? 100 : 0

      // logika lock hybrid
      if (module.category === 'reference') {
        module.is_locked = false
      } else if (module.category === 'core') {
        if (module.order_index <= 1) {
          module.is_locked = false
        } else {
          // core N terbuka kalau core N-1 selesai
          const prev = await knex('modules')
            .where({ category: 'core', order_index: module.order_index - 1, is_deleted: 0 })
            .first()
          if (!prev) { module.is_locked = false }
          else {
            const prevQuiz = await knex('quiz')
              .where({ modules_id: prev.id, created_by: userId, is_completed: 1, is_deleted: 0 })
            module.is_locked = prevQuiz.length === 0
          }
        }
      } else if (module.category === 'advanced') {
        // advanced terbuka kalau semua core selesai
        const coreMods = await knex('modules').where({ category: 'core', is_deleted: 0 })
        let allCoreDone = coreMods.length > 0
        for (const cm of coreMods) {
          const q = await knex('quiz')
            .where({ modules_id: cm.id, created_by: userId, is_completed: 1, is_deleted: 0 })
          if (q.length === 0) { allCoreDone = false; break }
        }
        module.is_locked = !allCoreDone
      } else {
        module.is_locked = false
      }
    } catch (err) {
      console.error('Error computing learning status:', err.message)
      module.is_completed = false
      module.progress_percent = 0
      module.is_locked = false
    }
  }
};

export const modules = app => {
  app.use(modulesPath, new ModulesService(getOptions(app)), {
    methods: modulesMethods,
    events: []
  });

  app.service(modulesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(modulesExternalResolver),
        schemaHooks.resolveResult(modulesResolver)
      ],
      create: [],
      patch: [],
      remove: []
    },
    before: {
      all: [
        schemaHooks.validateQuery(modulesQueryValidator),
        schemaHooks.resolveQuery(modulesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(modulesDataValidator),
        schemaHooks.resolveData(modulesDataResolver),
        async (context) => {
          if ('highlight_words' in context.data && context.data.highlight_words != null) {
            const v = context.data.highlight_words
            context.data.highlight_words = Array.isArray(v) ? v : (typeof v === 'string' ? JSON.parse(v) : [v].filter(Boolean))
          }
          return context
        }
      ],
      patch: [
        schemaHooks.validateData(modulesPatchValidator),
        schemaHooks.resolveData(modulesPatchResolver),
        async (context) => {
          if ('highlight_words' in context.data && context.data.highlight_words != null) {
            const v = context.data.highlight_words
            context.data.highlight_words = Array.isArray(v) ? v : (typeof v === 'string' ? JSON.parse(v) : [v].filter(Boolean))
          }
          return context
        }
      ],
      remove: []
    },
    after: {
      find: [
        alterItems(moduleResolvers.instructorProfile),
        alterItems(moduleResolvers.learningStatus)
      ],
      get: [
        alterItems(moduleResolvers.instructorProfile),
        alterItems(moduleResolvers.learningStatus)
      ],
      all: []
    },
    error: {
      all: []
    }
  })
}