import { KnexService } from '@feathersjs/knex'

export class DonationsService extends KnexService {
  async find (params) {
    const userId = params?.user?.id ?? params?.userId ?? null
    const query = this._buildQuery(params)
    if (userId != null) {
      query.where('user_id', userId)
    }
    const data = await this._executeQuery(query, params, false)
    return this._formatResult(data, params)
  }
}

export const getOptions = app => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'donations'
  }
}
