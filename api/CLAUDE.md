# API — Fastify

## Stack
- Fastify 4, Node 20, ESM (`"type": "module"`)
- Port 3001

## DATA_PATH
All routes read/write JSON from `DATA_PATH` env var (defaults to `../data` relative to cwd).
In Docker: `DATA_PATH=/data` (mounted volume).

## Routes

### Profile
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/profile | Full profile JSON |
| GET/PUT | /api/profile/bio | name, role, contacts |
| GET/POST | /api/profile/missions | List / add mission |
| GET/PUT/DELETE | /api/profile/missions/:index | Single mission by array index |
| GET/POST | /api/profile/employment | List / add employment (profile.companies array) |
| GET/PUT/DELETE | /api/profile/employment/:index | Single employment entry |
| GET/POST | /api/profile/education | List / add education |
| GET/PUT/DELETE | /api/profile/education/:index | Single education entry |
| GET/POST | /api/profile/events | List / add event |
| GET/PUT/DELETE | /api/profile/events/:index | Single event |

### Companies (référentiel)
| Method | Path | Description |
|--------|------|-------------|
| GET/POST | /api/companies | List / add company |
| GET/PUT/DELETE | /api/companies/:index | Single company |

### Technologies (référentiel)
| Method | Path | Description |
|--------|------|-------------|
| GET/POST | /api/technologies | List / add technology |
| GET/PUT/DELETE | /api/technologies/:index | Single technology |

### Images (CDN)
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/images | List all images (recursive scan of data/icons/) |
| POST | /api/upload?folder=xxx | Upload image (multipart, max 10 MB) |
| GET | /icons/{folder}/{file} | Serve image (fastify-static) |

### Raw JSON editor
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/raw/:file | Return raw JSON file (profile, companies, technologies) |
| PUT | /api/raw/:file | Overwrite JSON file (auth required) |

### Misc
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/youtube-stats | Proxy to aylabs.fr/youtube-stats.json |

## Auth
All non-GET routes require `X-Admin-Secret: <API_SECRET>` header.
If `API_SECRET` env var is not set, auth is disabled (dev mode).

## Local dev
```bash
cd api
npm install
node src/index.js
# or: npm run dev (uses --watch)
```
