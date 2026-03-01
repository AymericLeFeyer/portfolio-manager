export default async function aylabsRoutes(fastify) {
  fastify.get('/youtube-stats', async (_request, reply) => {
    const response = await fetch('https://aylabs.fr/youtube-stats.json')
    if (!response.ok) {
      return reply.code(response.status).send({ error: 'Upstream error' })
    }
    const data = await response.json()
    return data
  })
}
