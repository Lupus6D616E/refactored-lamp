

import { Elysia, t } from 'elysia'

const app = new Elysia() 
    .get('/', () => 'Hello Vercel Function')
    .get('/bingus', () => 'Hello Vercel!')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })


export const config = {
  runtime: 'edge'
}

export default app.fetch