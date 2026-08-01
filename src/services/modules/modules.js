// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

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
import { authenticate } from '@feathersjs/authentication'

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
    const knex = context.app.get('postgresql')
    try {
      module.is_completed = false
      module.progress_percent = 0

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

  if (!app.get('unlockAllPatched')) {
    app.set('unlockAllPatched', true)
    app.use('/modules/unlock-all', {
      async create(data, params) {
        const knex = app.get('postgresql')
        await knex('modules').where({ is_deleted: 0 }).update({ is_locked: false })
        return { ok: true, unlocked: true }
      }
    })
  }

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
          const d = context.data
          if (d.highlight_words === undefined || d.highlight_words === null || d.highlight_words === '' ) {
            d.highlight_words = '[]'
          } else if (typeof d.highlight_words === 'string') {
            try { d.highlight_words = JSON.stringify(JSON.parse(d.highlight_words)) }
            catch { d.highlight_words = '[]' }
          } else if (!Array.isArray(d.highlight_words)) {
            d.highlight_words = '[]'
          } else {
            d.highlight_words = JSON.stringify(d.highlight_words.map(x => String(x)))
          }
          if (!d.instructor_id && context.params?.user?.id) {
            d.instructor_id = context.params.user.id
          }
          console.log('[modules.create] normalized highlight_words:', d.highlight_words, 'instructor_id:', d.instructor_id)
          return context
        }
      ],
      patch: [
        schemaHooks.validateData(modulesPatchValidator),
        schemaHooks.resolveData(modulesPatchResolver),
        async (context) => {
          const d = context.data
          if ('highlight_words' in d) {
            if (d.highlight_words === undefined || d.highlight_words === null || d.highlight_words === '' ) {
              d.highlight_words = []
            } else if (typeof d.highlight_words === 'string') {
              try { d.highlight_words = JSON.parse(d.highlight_words) }
              catch { d.highlight_words = [] }
            } else if (!Array.isArray(d.highlight_words)) {
              d.highlight_words = []
            } else {
              d.highlight_words = d.highlight_words.map(x => String(x))
            }
          }
          console.log('[modules.patch] normalized highlight_words:', JSON.stringify(d.highlight_words))
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