import { Elysia, t } from 'elysia'
import { searchModel } from './model'
import {Search} from './service'
export const searchPlugin = new Elysia({ prefix: '/api' }) // optional prefix
  .get(
    '/search',
    async ({ query }) => {
      // query is fully typed!
      console.log('Received filters:', query)
      const result = await Search.find(query)
      console.log(result)
      return {
        results: result, // ← your actual results
       
      }
    },
    {
      // Define expected query schema → full type-safety + validation
      query: searchModel.searchQuery
    }
  )