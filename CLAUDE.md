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

## CI/CD — Images Docker (GHCR)

Workflow : `.github/workflows/docker-publish.yml`

| Élément | Valeur |
|---|---|
| Déclencheurs | push sur `main`, tags `v*`, PR vers `main` (build only, pas de push), `workflow_dispatch` |
| Images | `ghcr.io/aymericlefeyer/portfolio-manager-api`<br>`ghcr.io/aymericlefeyer/portfolio-manager-admin` |
| Tags générés | `latest` (main), nom de branche, `pr-<n>`, `sha-<short>`, `X.Y.Z` + `X.Y` (sur tag `v*`) |
| Plateforme | `linux/amd64` |
| Auth registry | `GITHUB_TOKEN` (permission `packages: write`) — aucun PAT à créer |
| Cache | GitHub Actions cache, scopé par image (`scope=api` / `scope=admin`) |

**Secret requis** : `API_SECRET` dans *Settings → Secrets and variables → Actions*. Il est passé en build-arg `VITE_ADMIN_SECRET` à l'image admin.

⚠️ **Le secret est compilé dans le bundle JS de l'image admin** (Vite inline `import.meta.env.*` au build) et reste lisible dans `docker history`. Le package GHCR `portfolio-manager-admin` **doit rester privé**.

## Déploiement Portainer
Déployer uniquement le service `api`. L'admin reste en local (`npm run dev`).

Stack Portainer à partir des images publiées : `docker-compose.ghcr.yml`
(variables : `API_SECRET` obligatoire, `IMAGE_TAG` optionnel — défaut `latest`).
Pour tirer les images : ajouter un registry `ghcr.io` dans Portainer avec un PAT
GitHub scope `read:packages`.

`docker-compose.yml` reste le fichier de build local (`docker-compose up --build`).

## Sous-projets
- `api/CLAUDE.md` — routes API, DATA_PATH
- `admin/CLAUDE.md` — pages, patterns, API client
