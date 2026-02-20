

import { Elysia, t } from 'elysia'

const app = new Elysia() 
    .get('/', () => 'Hello Vercel Function')
    .get('/bingus', () => 'Hello Vercel!')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export default async function handler(req: Request) {
  return app.fetch(req)
}