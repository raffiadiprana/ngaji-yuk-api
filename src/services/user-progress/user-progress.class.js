import { KnexService } from '@feathersjs/knex'

export class UserProgressService extends KnexService {}

export const getOptions = app => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'user_progress'
  }
}
