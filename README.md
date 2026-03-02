# Portfolio Manager

Outil d'administration pour gérer les données JSON du portfolio via une interface web guidée.
L'admin tourne **en local uniquement** ; seule l'API est déployée sur le serveur.

## Screenshots
<img width="1869" height="686" alt="Modification des missions" src="https://github.com/user-attachments/assets/6554de4d-1847-423f-bea3-46d3ac30dc2e" />
<img width="1879" height="811" alt="Modification brute du JSON" src="https://github.com/user-attachments/assets/a00f32fb-c67a-410e-addf-cb3364621b7f" />
<img width="1883" height="885" alt="Ajout de nouvelles icones" src="https://github.com/user-attachments/assets/f59ebc00-2485-45d1-adca-e7927c88214d" />




---

## Architecture

```
portfolio-manager/
├── data/                   ← Données persistantes (volume Docker partagé)
│   ├── profile.json        ← profil, missions, emploi, formation, évènements
│   ├── companies.json      ← référentiel entreprises
│   ├── technologies.json   ← référentiel technologies
│   └── icons/              ← images uploadées (non versionnées)
│       ├── companies/
│       ├── technologies/
│       └── misc/
├── api/                    ← Fastify 4, Node 20, ESM — port 3001
│   ├── src/
│   │   ├── index.js        ← point d'entrée, CORS, plugins
│   │   └── routes/
│   │       ├── profile.js
│   │       ├── companies.js
│   │       ├── technologies.js
│   │       └── images.js   ← CDN listing + upload
│   └── package.json
├── admin/                  ← React 18 + Vite 5 + Ant Design 5
│   ├── src/
│   │   ├── pages/          ← une page par entité (CRUD Drawer)
│   │   └── components/
│   │       └── ImagePicker.jsx
│   ├── nginx.conf          ← proxy API + icons en production
│   └── package.json
├── docker-compose.yml
└── CLAUDE.md               ← instructions pour Claude Code
```

---

## Lancer en développement (local)

```bash
# 1. API
cd api
npm install
node src/index.js          # écoute sur http://localhost:3001

# 2. Admin (autre terminal)
cd admin
npm install
npm run dev                # écoute sur http://localhost:5173
```

Vite proxifie automatiquement `/api` et `/icons` vers `:3001`.
Ouvre http://localhost:5173 dans le navigateur.

---

## Lancer avec Docker

```bash
docker-compose up --build
```

- API exposée sur http://localhost:3001
- Admin exposée sur http://localhost:3000 (nginx sert le build React + proxifie vers l'API)

> L'admin Docker est pratique pour tester le build de production, mais en usage quotidien
> préfère le mode dev (`npm run dev`) qui recharge à chaud.

---

## Déploiement serveur (Portainer)

Déployer **uniquement le service `api`** depuis `docker-compose.yml`.
L'admin reste en local (`npm run dev`).

Variables d'environnement à configurer sur le serveur :
| Variable | Valeur exemple | Rôle |
|---|---|---|
| `DATA_PATH` | `/data` | Chemin vers le dossier de données (monté en volume) |
| `ALLOWED_ORIGINS` | `http://localhost:5173,http://monip:5173` | Origines autorisées par le CORS |

Le volume Docker monte `./data` (ou un répertoire serveur) dans `/data` dans le conteneur.

---

## Pages de l'admin

| URL | Description |
|-----|-------------|
| `/profile` | Nom, rôle, contacts |
| `/missions` | Missions freelance / projets |
| `/employment` | Expériences professionnelles |
| `/education` | Formations |
| `/events` | Talks, certifications, conférences |
| `/companies` | Référentiel entreprises |
| `/technologies` | Référentiel technologies |

Chaque page = tableau + formulaire dans un Drawer latéral.

---

## CDN d'images

Les icônes sont servies directement par l'API Fastify :

```
GET  /icons/{folder}/{fichier.png}       ← sert l'image
GET  /api/images                         ← liste toutes les images
POST /api/upload?folder={dossier}        ← upload multipart (max 10 Mo)
```

Dossiers disponibles : `companies`, `technologies`, `misc`.

Les champs "Icône" dans les formulaires utilisent le composant **ImagePicker** :
une miniature inline + modal avec upload glisser-déposer et grille de sélection.
La valeur stockée en JSON est un path relatif `/icons/companies/aylabs.png`
(pas de host hardcodé, fonctionne en dev et en prod).

---

## Structure des données JSON

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

## Routes API

### Profil
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/profile` | Profil complet |
| GET / PUT | `/api/profile/bio` | Nom, rôle, contacts |
| GET / POST | `/api/profile/missions` | Liste / ajout mission |
| GET / PUT / DELETE | `/api/profile/missions/:index` | Mission par index |
| GET / POST | `/api/profile/employment` | Liste / ajout emploi |
| GET / PUT / DELETE | `/api/profile/employment/:index` | Emploi par index |
| GET / POST | `/api/profile/education` | Liste / ajout formation |
| GET / PUT / DELETE | `/api/profile/education/:index` | Formation par index |
| GET / POST | `/api/profile/events` | Liste / ajout évènement |
| GET / PUT / DELETE | `/api/profile/events/:index` | Évènement par index |

### Référentiels
| Méthode | Route | Description |
|---------|-------|-------------|
| GET / POST | `/api/companies` | Liste / ajout entreprise |
| GET / PUT / DELETE | `/api/companies/:index` | Entreprise par index |
| GET / POST | `/api/technologies` | Liste / ajout technologie |
| GET / PUT / DELETE | `/api/technologies/:index` | Technologie par index |

### Images
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/images` | Liste toutes les images |
| POST | `/api/upload?folder=xxx` | Upload une image |
| GET | `/icons/{folder}/{fichier}` | Sert l'image (CDN statique) |
