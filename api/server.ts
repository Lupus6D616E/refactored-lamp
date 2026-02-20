

import { Elysia, t } from 'elysia'

export default new Elysia() 
    .get('/', () => 'Hello Vercel Function')
    .get('/bingus', () => 'Hello Vercel!')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })