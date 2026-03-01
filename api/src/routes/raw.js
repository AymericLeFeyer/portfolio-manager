import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const DATA_PATH = process.env.DATA_PATH || join(process.cwd(), 'data')

const ALLOWED_FILES = ['profile', 'companies', 'technologies']

export default async function rawRoutes(fastify) {
  fastify.get('/raw/:file', async (request, reply) => {
    const { file } = request.params
    if (!ALLOWED_FILES.includes(file)) {
      return reply.code(404).send({ error: 'Not found' })
    }
    const raw = await readFile(join(DATA_PATH, `${file}.json`), 'utf-8')
    reply.header('Content-Type', 'application/json')
    return reply.send(raw)
  })

  fastify.put('/raw/:file', async (request, reply) => {
    const { file } = request.params
    if (!ALLOWED_FILES.includes(file)) {
      return reply.code(404).send({ error: 'Not found' })
    }
    await writeFile(join(DATA_PATH, `${file}.json`), JSON.stringify(request.body, null, 2), 'utf-8')
    reply.code(204).send()
  })
}
