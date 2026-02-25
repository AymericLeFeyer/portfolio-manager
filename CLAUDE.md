# Portfolio Manager

Outil d'administration pour gérer les données JSON du portfolio via une interface guidée.

## Architecture

```
portfolio-manager/
├── data/                     ← JSON files (volume Docker partagé)
│   ├── profile.json          ← profil, missions, emploi, formation, évènements
│   ├── companies.json        ← référentiel entreprises
│   └── technologies.json     ← référentiel technologies
├── api/                      ← Fastify backend (Node 20, ESM)
├── admin/                    ← React + Vite + Ant Design (local only)
├── docker-compose.yml
└── CLAUDE.md
```

## Data structure

### profile.json
```json
{
  "name": "...",
  "role": "...",
  "contacts": { "email", "phone", "linkedin", "github" },
  "companies": [ { company, position, start_date, end_date, row, responsibilities[] } ],
  "education": [ { institution, degree, start_date, end_date, icon } ],
  "missions": [ { title, context, company, start_date, end_date, row, is_side_project, link?, technologies[], tasks[] } ],
  "events": [ { name, date, description, type, icon } ]
}
```

### companies.json
```json
[ { "name": "...", "icon": "..." } ]
```

### technologies.json
```json
[ { "name": "...", "icon": "...", "category": "..." } ]
```

## Quick start

```bash
# API seule
cd api && npm install && node src/index.js

# Admin (dev)
cd admin && npm install && npm run dev

# Docker (tout)
docker-compose up --build
```

## Déploiement Portainer
Déployer uniquement le service `api`. L'admin reste en local (`npm run dev`).

## Sous-projets
- `api/CLAUDE.md` — routes API, DATA_PATH
- `admin/CLAUDE.md` — pages, patterns, API client
