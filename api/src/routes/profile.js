import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const DATA_PATH = process.env.DATA_PATH || join(process.cwd(), 'data')

async function readProfile() {
  const raw = await readFile(join(DATA_PATH, 'profile.json'), 'utf-8')
  return JSON.parse(raw)
}

async function writeProfile(data) {
  await writeFile(join(DATA_PATH, 'profile.json'), JSON.stringify(data, null, 2), 'utf-8')
}

export default async function profileRoutes(fastify) {
  // Full profile (for public portfolio)
  fastify.get('/profile', async () => {
    return readProfile()
  })

  // Bio (name, role, contacts)
  fastify.get('/profile/bio', async () => {
    const profile = await readProfile()
    return { name: profile.name, role: profile.role, contacts: profile.contacts }
  })

  fastify.put('/profile/bio', async (request) => {
    const profile = await readProfile()
    const { name, role, contacts } = request.body
    if (name !== undefined) profile.name = name
    if (role !== undefined) profile.role = role
    if (contacts !== undefined) profile.contacts = contacts
    await writeProfile(profile)
    return { name: profile.name, role: profile.role, contacts: profile.contacts }
  })

  // Missions
  fastify.get('/profile/missions', async () => {
    const profile = await readProfile()
    return profile.missions || []
  })

  fastify.post('/profile/missions', async (request, reply) => {
    const profile = await readProfile()
    if (!profile.missions) profile.missions = []
    profile.missions.push(request.body)
    await writeProfile(profile)
    reply.code(201)
    return profile.missions[profile.missions.length - 1]
  })

  fastify.get('/profile/missions/:index', async (request, reply) => {
    const profile = await readProfile()
    const idx = parseInt(request.params.index)
    if (!profile.missions || idx < 0 || idx >= profile.missions.length) {
      return reply.code(404).send({ error: 'Not found' })
    }
    return profile.missions[idx]
  })

  fastify.put('/profile/missions/:index', async (request, reply) => {
    const profile = await readProfile()
    const idx = parseInt(request.params.index)
    if (!profile.missions || idx < 0 || idx >= profile.missions.length) {
      return reply.code(404).send({ error: 'Not found' })
    }
    profile.missions[idx] = request.body
    await writeProfile(profile)
    return profile.missions[idx]
  })

  fastify.delete('/profile/missions/:index', async (request, reply) => {
    const profile = await readProfile()
    const idx = parseInt(request.params.index)
    if (!profile.missions || idx < 0 || idx >= profile.missions.length) {
      return reply.code(404).send({ error: 'Not found' })
    }
    profile.missions.splice(idx, 1)
    await writeProfile(profile)
    reply.code(204).send()
  })

  // Employment (companies array in profile)
  fastify.get('/profile/employment', async () => {
    const profile = await readProfile()
    return profile.companies || []
  })

  fastify.post('/profile/employment', async (request, reply) => {
    const profile = await readProfile()
    if (!profile.companies) profile.companies = []
    profile.companies.push(request.body)
    await writeProfile(profile)
    reply.code(201)
    return profile.companies[profile.companies.length - 1]
  })

  fastify.get('/profile/employment/:index', async (request, reply) => {
    const profile = await readProfile()
    const idx = parseInt(request.params.index)
    if (!profile.companies || idx < 0 || idx >= profile.companies.length) {
      return reply.code(404).send({ error: 'Not found' })
    }
    return profile.companies[idx]
  })

  fastify.put('/profile/employment/:index', async (request, reply) => {
    const profile = await readProfile()
    const idx = parseInt(request.params.index)
    if (!profile.companies || idx < 0 || idx >= profile.companies.length) {
      return reply.code(404).send({ error: 'Not found' })
    }
    profile.companies[idx] = request.body
    await writeProfile(profile)
    return profile.companies[idx]
  })

  fastify.delete('/profile/employment/:index', async (request, reply) => {
    const profile = await readProfile()
    const idx = parseInt(request.params.index)
    if (!profile.companies || idx < 0 || idx >= profile.companies.length) {
      return reply.code(404).send({ error: 'Not found' })
    }
    profile.companies.splice(idx, 1)
    await writeProfile(profile)
    reply.code(204).send()
  })

  // Education
  fastify.get('/profile/education', async () => {
    const profile = await readProfile()
    return profile.education || []
  })

  fastify.post('/profile/education', async (request, reply) => {
    const profile = await readProfile()
    if (!profile.education) profile.education = []
    profile.education.push(request.body)
    await writeProfile(profile)
    reply.code(201)
    return profile.education[profile.education.length - 1]
  })

  fastify.get('/profile/education/:index', async (request, reply) => {
    const profile = await readProfile()
    const idx = parseInt(request.params.index)
    if (!profile.education || idx < 0 || idx >= profile.education.length) {
      return reply.code(404).send({ error: 'Not found' })
    }
    return profile.education[idx]
  })

  fastify.put('/profile/education/:index', async (request, reply) => {
    const profile = await readProfile()
    const idx = parseInt(request.params.index)
    if (!profile.education || idx < 0 || idx >= profile.education.length) {
      return reply.code(404).send({ error: 'Not found' })
    }
    profile.education[idx] = request.body
    await writeProfile(profile)
    return profile.education[idx]
  })

  fastify.delete('/profile/education/:index', async (request, reply) => {
    const profile = await readProfile()
    const idx = parseInt(request.params.index)
    if (!profile.education || idx < 0 || idx >= profile.education.length) {
      return reply.code(404).send({ error: 'Not found' })
    }
    profile.education.splice(idx, 1)
    await writeProfile(profile)
    reply.code(204).send()
  })

  // Events
  fastify.get('/profile/events', async () => {
    const profile = await readProfile()
    return profile.events || []
  })

  fastify.post('/profile/events', async (request, reply) => {
    const profile = await readProfile()
    if (!profile.events) profile.events = []
    profile.events.push(request.body)
    await writeProfile(profile)
    reply.code(201)
    return profile.events[profile.events.length - 1]
  })

  fastify.get('/profile/events/:index', async (request, reply) => {
    const profile = await readProfile()
    const idx = parseInt(request.params.index)
    if (!profile.events || idx < 0 || idx >= profile.events.length) {
      return reply.code(404).send({ error: 'Not found' })
    }
    return profile.events[idx]
  })

  fastify.put('/profile/events/:index', async (request, reply) => {
    const profile = await readProfile()
    const idx = parseInt(request.params.index)
    if (!profile.events || idx < 0 || idx >= profile.events.length) {
      return reply.code(404).send({ error: 'Not found' })
    }
    profile.events[idx] = request.body
    await writeProfile(profile)
    return profile.events[idx]
  })

  fastify.delete('/profile/events/:index', async (request, reply) => {
    const profile = await readProfile()
    const idx = parseInt(request.params.index)
    if (!profile.events || idx < 0 || idx >= profile.events.length) {
      return reply.code(404).send({ error: 'Not found' })
    }
    profile.events.splice(idx, 1)
    await writeProfile(profile)
    reply.code(204).send()
  })
}
