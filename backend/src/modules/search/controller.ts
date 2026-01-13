import { Elysia, t } from 'elysia'
import { searchModel } from './model'

export const searchPlugin = new Elysia({ prefix: '/api' }) // optional prefix
  .get(
    '/search',
    ({ query }) => {
      // query is fully typed!
      console.log('Received filters:', query)

      // Your search logic here...
      return {
        success: true,
        results: [], // ← your actual results
        filtersApplied: query
      }
    },
    {
      // Define expected query schema → full type-safety + validation
      query: searchModel.searchQuery
    }
  )