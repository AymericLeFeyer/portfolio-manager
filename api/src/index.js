import { mkdir } from 'fs/promises'
import { join } from 'path'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import profileRoutes from './routes/profile.js'
import companiesRoutes from './routes/companies.js'
import technologiesRoutes from './routes/technologies.js'
import imagesRoutes from './routes/images.js'

const DATA_PATH = process.env.DATA_PATH || join(process.cwd(), 'data')

await mkdir(join(DATA_PATH, 'icons'), { recursive: true })

const API_SECRET = process.env.API_SECRET

const fastify = Fastify({ logger: true })

await fastify.register(cors, { origin: {
  origin: [
      'https://timelife.aymeric.lefeyer.fr',
      'https://aymeric.lefeyer.fr',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4173',
    ],
} })

fastify.addHook('onRequest', async (request, reply) => {
  if (request.method === 'GET') return
  if (!API_SECRET) return
  if (request.headers['x-admin-secret'] !== API_SECRET) {
    return reply.code(401).send({ error: 'Unauthorized' })
  }
})

await fastify.register(fastifyMultipart, { limits: { fileSize: 10 * 1024 * 1024 } })

await fastify.register(fastifyStatic, {
  root: join(DATA_PATH, 'icons'),
  prefix: '/icons/',
  decorateReply: false,
})

await fastify.register(profileRoutes, { prefix: '/api' })
await fastify.register(companiesRoutes, { prefix: '/api' })
await fastify.register(technologiesRoutes, { prefix: '/api' })
await fastify.register(imagesRoutes, { prefix: '/api' })

try {
  await fastify.listen({ port: 3001, host: '0.0.0.0' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
