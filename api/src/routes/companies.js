import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const DATA_PATH = process.env.DATA_PATH || join(process.cwd(), 'data')

async function readCompanies() {
  const raw = await readFile(join(DATA_PATH, 'companies.json'), 'utf-8')
  return JSON.parse(raw)
}

async function writeCompanies(data) {
  await writeFile(join(DATA_PATH, 'companies.json'), JSON.stringify(data, null, 2), 'utf-8')
}

export default async function companiesRoutes(fastify) {
  fastify.get('/companies', async () => {
    return readCompanies()
  })

  fastify.post('/companies', async (request, reply) => {
    const companies = await readCompanies()
    companies.push(request.body)
    await writeCompanies(companies)
    reply.code(201)
    return companies[companies.length - 1]
  })

  fastify.get('/companies/:index', async (request, reply) => {
    const companies = await readCompanies()
    const idx = parseInt(request.params.index)
    if (idx < 0 || idx >= companies.length) {
      return reply.code(404).send({ error: 'Not found' })
    }
    return companies[idx]
  })

  fastify.put('/companies/:index', async (request, reply) => {
    const companies = await readCompanies()
    const idx = parseInt(request.params.index)
    if (idx < 0 || idx >= companies.length) {
      return reply.code(404).send({ error: 'Not found' })
    }
    companies[idx] = request.body
    await writeCompanies(companies)
    return companies[idx]
  })

  fastify.delete('/companies/:index', async (request, reply) => {
    const companies = await readCompanies()
    const idx = parseInt(request.params.index)
    if (idx < 0 || idx >= companies.length) {
      return reply.code(404).send({ error: 'Not found' })
    }
    companies.splice(idx, 1)
    await writeCompanies(companies)
    reply.code(204).send()
  })
}
