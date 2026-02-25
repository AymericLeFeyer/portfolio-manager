import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const DATA_PATH = process.env.DATA_PATH || join(process.cwd(), '..', 'data')

async function readTechnologies() {
  const raw = await readFile(join(DATA_PATH, 'technologies.json'), 'utf-8')
  return JSON.parse(raw)
}

async function writeTechnologies(data) {
  await writeFile(join(DATA_PATH, 'technologies.json'), JSON.stringify(data, null, 2), 'utf-8')
}

export default async function technologiesRoutes(fastify) {
  fastify.get('/technologies', async () => {
    return readTechnologies()
  })

  fastify.post('/technologies', async (request, reply) => {
    const technologies = await readTechnologies()
    technologies.push(request.body)
    await writeTechnologies(technologies)
    reply.code(201)
    return technologies[technologies.length - 1]
  })

  fastify.get('/technologies/:index', async (request, reply) => {
    const technologies = await readTechnologies()
    const idx = parseInt(request.params.index)
    if (idx < 0 || idx >= technologies.length) {
      return reply.code(404).send({ error: 'Not found' })
    }
    return technologies[idx]
  })

  fastify.put('/technologies/:index', async (request, reply) => {
    const technologies = await readTechnologies()
    const idx = parseInt(request.params.index)
    if (idx < 0 || idx >= technologies.length) {
      return reply.code(404).send({ error: 'Not found' })
    }
    technologies[idx] = request.body
    await writeTechnologies(technologies)
    return technologies[idx]
  })

  fastify.delete('/technologies/:index', async (request, reply) => {
    const technologies = await readTechnologies()
    const idx = parseInt(request.params.index)
    if (idx < 0 || idx >= technologies.length) {
      return reply.code(404).send({ error: 'Not found' })
    }
    technologies.splice(idx, 1)
    await writeTechnologies(technologies)
    reply.code(204).send()
  })
}
