import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  userProgressDataValidator,
  userProgressPatchValidator,
  userProgressQueryValidator,
  userProgressResolver,
  userProgressExternalResolver,
  userProgressDataResolver,
  userProgressPatchResolver,
  userProgressQueryResolver
} from './user-progress.schema.js'
import { UserProgressService, getOptions } from './user-progress.class.js'
import { userProgressPath, userProgressMethods } from './user-progress.shared.js'

export * from './user-progress.class.js'
export * from './user-progress.schema.js'

export const userProgress = app => {
  app.use(userProgressPath, new UserProgressService(getOptions(app)), {
    methods: userProgressMethods,
    events: []
  })

  app.service(userProgressPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(userProgressExternalResolver),
        schemaHooks.resolveResult(userProgressResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(userProgressQueryValidator),
        schemaHooks.resolveQuery(userProgressQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(userProgressDataValidator),
        schemaHooks.resolveData(userProgressDataResolver)
      ],
      patch: [
        schemaHooks.validateData(userProgressPatchValidator),
        schemaHooks.resolveData(userProgressPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
