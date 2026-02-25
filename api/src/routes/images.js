import { readdir, mkdir } from 'fs/promises'
import { createWriteStream } from 'fs'
import { join } from 'path'
import { pipeline } from 'stream/promises'

const DATA_PATH = process.env.DATA_PATH || join(process.cwd(), '..', 'data')
const ICONS_PATH = join(DATA_PATH, 'icons')

export default async function imagesRoutes(fastify) {
  fastify.get('/images', async () => {
    try {
      const files = await readdir(ICONS_PATH, { recursive: true })
      return files
        .filter(f => /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(f))
        .map(f => {
          const normalized = f.replace(/\\/g, '/')
          const parts = normalized.split('/')
          const folder = parts.length > 1 ? parts[0] : ''
          const name = parts[parts.length - 1]
          return { path: `/icons/${normalized}`, name, folder }
        })
    } catch {
      return []
    }
  })

  fastify.post('/upload', async (request, reply) => {
    const folder = request.query.folder || 'misc'
    const targetDir = join(ICONS_PATH, folder)
    await mkdir(targetDir, { recursive: true })

    const data = await request.file()
    if (!data) return reply.code(400).send({ error: 'No file' })

    const filename = data.filename
    await pipeline(data.file, createWriteStream(join(targetDir, filename)))

    return { path: `/icons/${folder}/${filename}`, name: filename }
  })
}
