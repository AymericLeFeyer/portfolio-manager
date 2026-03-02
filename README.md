# Portfolio Manager

An administration tool to manage portfolio JSON data through a guided web interface.
The admin runs **locally only**; only the API is deployed on the server.

## Screenshots
<img width="1869" height="686" alt="Editing missions" src="https://github.com/user-attachments/assets/6554de4d-1847-423f-bea3-46d3ac30dc2e" />
<img width="1879" height="811" alt="Raw JSON editor" src="https://github.com/user-attachments/assets/a00f32fb-c67a-410e-addf-cb3364621b7f" />
<img width="1883" height="885" alt="Adding new icons" src="https://github.com/user-attachments/assets/f59ebc00-2485-45d1-adca-e7927c88214d" />




---

## Architecture

```
portfolio-manager/
├── data/                   ← Persistent data (shared Docker volume)
│   ├── profile.json        ← profile, missions, employment, education, events
│   ├── companies.json      ← companies reference list
│   ├── technologies.json   ← technologies reference list
│   └── icons/              ← uploaded images (not versioned)
│       ├── companies/
│       ├── technologies/
│       └── misc/
├── api/                    ← Fastify 4, Node 20, ESM — port 3001
│   ├── src/
│   │   ├── index.js        ← entry point, CORS, plugins
│   │   └── routes/
│   │       ├── profile.js
│   │       ├── companies.js
│   │       ├── technologies.js
│   │       ├── images.js   ← CDN listing + upload
│   │       ├── raw.js      ← raw JSON editor
│   │       └── aylabs.js   ← YouTube stats proxy
│   └── package.json
├── admin/                  ← React 18 + Vite 5 + Ant Design 5
│   ├── src/
│   │   ├── pages/          ← one page per entity (CRUD Drawer)
│   │   └── components/
│   │       └── ImagePicker.jsx
│   ├── nginx.conf          ← API + icons proxy in production
│   └── package.json
├── docker-compose.yml
└── CLAUDE.md               ← instructions for Claude Code
```

---

## Running in development (local)

```bash
# 1. API
cd api
npm install
node src/index.js          # listens on http://localhost:3001

# 2. Admin (another terminal)
cd admin
npm install
npm run dev                # listens on http://localhost:5173
```

Vite automatically proxies `/api` and `/icons` to `:3001`.
Open http://localhost:5173 in your browser.

---

## Running with Docker

```bash
docker-compose up --build
```

- API exposed on http://localhost:3001
- Admin exposed on http://localhost:3000 (nginx serves the React build + proxies to the API)

> The Docker admin is handy for testing the production build, but for daily use
> prefer dev mode (`npm run dev`) which supports hot reload.

---

## Server deployment (Portainer)

Deploy **only the `api` service** from `docker-compose.yml`.
The admin stays local (`npm run dev`).

Environment variables to configure on the server:
| Variable | Example value | Purpose |
|---|---|---|
| `DATA_PATH` | `/data` | Path to the data folder (mounted as a volume) |
| `API_SECRET` | `my-secret` | Protects all write routes (POST/PUT/DELETE) via the `X-Admin-Secret` header |

> If `API_SECRET` is not set, protection is disabled (useful in local dev).

The Docker volume mounts `./data` (or a server directory) into `/data` inside the container.

---

## Admin pages

| URL | Description |
|-----|-------------|
| `/profile` | Name, role, contacts |
| `/missions` | Freelance missions / projects |
| `/employment` | Work experience |
| `/education` | Education |
| `/events` | Talks, certifications, conferences |
| `/companies` | Companies reference list |
| `/technologies` | Technologies reference list |
| `/raw` | Raw JSON editor (all 3 files, with validation and download) |

CRUD pages = table + form in a side Drawer.

---

## Image CDN

Icons are served directly by the Fastify API:

```
GET  /icons/{folder}/{file.png}          ← serves the image
GET  /api/images                         ← lists all images
POST /api/upload?folder={folder}         ← multipart upload (max 10 MB)
```

Available folders: `companies`, `technologies`, `misc`.

"Icon" fields in forms use the **ImagePicker** component:
an inline thumbnail + modal with drag-and-drop upload and a selection grid.
The value stored in JSON is a relative path `/icons/companies/aylabs.png`
(no hardcoded host, works in both dev and prod).

---

## JSON data structure

### `profile.json`
```json
{
  "name": "...",
  "role": "...",
  "contacts": { "email": "", "phone": "", "linkedin": "", "github": "" },
  "companies": [
    { "company": "", "position": "", "start_date": "YYYY-MM", "end_date": "YYYY-MM", "row": 1, "responsibilities": [] }
  ],
  "education": [
    { "institution": "", "degree": "", "start_date": "YYYY-MM", "end_date": "YYYY-MM", "icon": "/icons/misc/..." }
  ],
  "missions": [
    {
      "title": "", "context": "", "company": "", "start_date": "YYYY-MM", "end_date": "YYYY-MM",
      "row": 1, "is_side_project": false, "link": "",
      "technologies": [{ "name": "", "frequency": 0.8, "comment": "" }],
      "tasks": []
    }
  ],
  "events": [
    { "name": "", "date": "YYYY-MM", "description": "", "type": "talk|certification|conference|other", "icon": "/icons/misc/..." }
  ]
}
```

### `companies.json`
```json
[{ "name": "AyLabs", "icon": "/icons/companies/aylabs.png" }]
```

### `technologies.json`
```json
[{ "name": "Kotlin", "icon": "/icons/technologies/kotlin.png", "category": "Language" }]
```

---

## API routes

### Profile
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/profile` | Full profile |
| GET / PUT | `/api/profile/bio` | Name, role, contacts |
| GET / POST | `/api/profile/missions` | List / add mission |
| GET / PUT / DELETE | `/api/profile/missions/:index` | Mission by index |
| GET / POST | `/api/profile/employment` | List / add employment |
| GET / PUT / DELETE | `/api/profile/employment/:index` | Employment by index |
| GET / POST | `/api/profile/education` | List / add education |
| GET / PUT / DELETE | `/api/profile/education/:index` | Education by index |
| GET / POST | `/api/profile/events` | List / add event |
| GET / PUT / DELETE | `/api/profile/events/:index` | Event by index |

### Reference lists
| Method | Route | Description |
|--------|-------|-------------|
| GET / POST | `/api/companies` | List / add company |
| GET / PUT / DELETE | `/api/companies/:index` | Company by index |
| GET / POST | `/api/technologies` | List / add technology |
| GET / PUT / DELETE | `/api/technologies/:index` | Technology by index |

### Images
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/images` | List all images |
| POST | `/api/upload?folder=xxx` | Upload an image (multipart, max 10 MB) |
| GET | `/icons/{folder}/{file}` | Serve the image (static CDN) |

### Raw JSON
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/raw/{profile\|companies\|technologies}` | Returns the JSON file as-is |
| PUT | `/api/raw/{profile\|companies\|technologies}` | Overwrites the JSON file (auth required) |

### Misc
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/youtube-stats` | Proxy to `aylabs.fr/youtube-stats.json` |

---

## Authentication

Write routes (POST / PUT / DELETE) are protected by a shared secret.

**API**: checks the `X-Admin-Secret: <API_SECRET>` header on all non-GET requests.

**Admin**: the axios client (`src/api/client.js`) automatically injects this header via an interceptor, from the `VITE_ADMIN_SECRET` environment variable.

In local dev without `API_SECRET` set, protection is disabled on the API side.

---

## License

This project is licensed under the [Portfolio Manager License](./LICENSE).
Free to use and modify — resale is prohibited.
