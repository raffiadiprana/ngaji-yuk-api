// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  answersDataValidator,
  answersPatchValidator,
  answersQueryValidator,
  answersResolver,
  answersExternalResolver,
  answersDataResolver,
  answersPatchResolver,
  answersQueryResolver
} from './answers.schema.js'
import { AnswersService, getOptions } from './answers.class.js'
import { answersPath, answersMethods } from './answers.shared.js'

import { authorize } from '../../hooks/authorize.js'

import { fastJoin, alterItems } from 'feathers-hooks-common'

export const answers = app => {
  const knexRef = () => app.get('postgresql')

  const userResolvers = {
    userDetail: async (answer, context) => {
      if (answer.user_id) {
        try {
          const moduleService = context.app.service('profiles');
          const modules = await moduleService.find({
            query: { user_id: answer.user_id },
            paginate: false
          });
          answer.user_detail = modules[0] || null;
        } catch (error) {
          console.error('Error fetching module detail', error);
          answer.module_detail = null;
        }
      }
    }
  };

  const quizResolvers = {
    quizDetail: async (answer, context) => {
      if (answer.quiz_id) {
        try {
          const quizService = context.app.service('quiz');
          const quiz = await quizService.find({
            query: { id: answer.quiz_id },
            paginate: false
          });
          answer.quiz_detail = quiz[0] || null;
        } catch (error) {
          console.error('Error fetching quiz detail', error);
          answer.quiz_detail = null;
        }
      }
    }
  };

  app.use('/answers/inbox', {
    async create(data, params) {
      const instructorId = Number(data?.instructor_id || params?.query?.instructor_id)
      if (!instructorId || isNaN(instructorId)) {
        throw new Error('instructor_id is required')
      }
      const mods = await knexRef()('modules').where({ instructor_id: instructorId, is_deleted: 0 }).select('id')
      const quizIds = [...new Set(mods.map(m => m.id).filter(Boolean))]
      if (!quizIds.length) return []
      const rows = await knexRef()('answers').whereIn('quiz_id', quizIds).orderBy('created_date', 'desc').limit(200)
      const userIds = [...new Set(rows.map(r => r.user_id).filter(Boolean))]
      const moduleIds = [...new Set(rows.map(r => r.quiz_id).filter(Boolean))]
      const users = userIds.length ? await knexRef()('users').whereIn('id', userIds).select('id', 'display_name', 'user_role') : []
      const modules = moduleIds.length ? await knexRef()('modules').whereIn('id', moduleIds).select('id', 'title', 'instructor_id') : []
      const userMap = Object.fromEntries(users.map(u => [u.id, u]))
      const moduleMap = Object.fromEntries(modules.map(m => [m.id, m]))
      const grouped = {}
      for (const row of rows) {
        row.user_detail = userMap[row.user_id] || null
        row.quiz_detail = { module_detail: moduleMap[row.quiz_id] || null }
        const key = row.quiz_id
        if (!grouped[key]) grouped[key] = { quiz_id: key, count: 0, lastAnswer: row }
        grouped[key].count += 1
        const current = grouped[key].lastAnswer
        const currentDate = typeof current.created_date === 'string' ? new Date(current.created_date).valueOf() : current.created_date
        const rowDate = typeof row.created_date === 'string' ? new Date(row.created_date).valueOf() : row.created_date
        if (rowDate > currentDate) grouped[key].lastAnswer = row
      }
      return Object.values(grouped).sort((a, b) => b.lastAnswer.created_date - a.lastAnswer.created_date)
    }
  })

  app.service('/answers/inbox').hooks({
    around: {
      all: [authenticate('jwt')]
    }
  })

  // Register our service on the Feathers application
  app.use(answersPath, new AnswersService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: answersMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(answersPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(answersExternalResolver),
        schemaHooks.resolveResult(answersResolver)
      ],
      create: [],
      patch: [],
      remove: []
    },
    before: {
      all: [
        schemaHooks.validateQuery(answersQueryValidator),
        schemaHooks.resolveQuery(answersQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(answersDataValidator),
        schemaHooks.resolveData(answersDataResolver),
        async (context) => {
          const d = context.data
          if (typeof d.answer_value === 'undefined' || d.answer_value === null || d.answer_value === '') {
            d.answer_value = ''
          }
          if (d.highlight_words === undefined || d.highlight_words === null || d.highlight_words === '') {
            d.highlight_words = '[]'
          }
          return context
        }
      ],
      patch: [
        schemaHooks.validateData(answersPatchValidator),
        schemaHooks.resolveData(answersPatchResolver),
      ],
      remove: []
    },
    after: {
      find: [
        alterItems(userResolvers.userDetail),
        alterItems(quizResolvers.quizDetail)
      ],
      get: [
        alterItems(userResolvers.userDetail),
        alterItems(quizResolvers.quizDetail)
      ],
      all: []
    },
    error: {
      all: []
    }
  })
}
