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

## Local dev
```bash
cd api
npm install
node src/index.js
# or: npm run dev (uses --watch)
```
