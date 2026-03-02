# Admin — React + Vite + Ant Design

## Stack
- React 18, Vite 5, Ant Design 5, React Router 6, Axios

## Dev
```bash
cd admin
npm install
npm run dev   # → http://localhost:5173
```
Vite proxies `/api` → `http://localhost:3001`.

## Pages (React Router)

| Path | Component | Description |
|------|-----------|-------------|
| /profile | ProfileInfo | name, role, contacts |
| /missions | Missions | CRUD missions (Drawer form) |
| /employment | Employment | CRUD emploi (profile.companies) |
| /education | Education | CRUD formation |
| /events | Events | CRUD évènements |
| /companies | Companies | Référentiel entreprises |
| /technologies | Technologies | Référentiel technologies |
| /raw | RawEditor | Édition JSON brut des 3 fichiers, avec validation live et téléchargement |

## Key patterns
- Each page: list (Table) + Drawer form
- All forms use Ant Design Form with `useForm()`
- `editIndex` is the array index (passed to API as `:index`)
- `src/api/client.js` — axios instance, baseURL = `/api` (proxied in dev, nginx in prod)
- The client auto-injects `X-Admin-Secret` header on all non-GET requests (from `VITE_ADMIN_SECRET` env var)
- Always import `client` from `src/api/client.js`, never use raw `axios` directly

## Autocomplete
- MissionForm: company name from `/api/companies`, technology name from `/api/technologies`
- EmploymentForm: company name from `/api/companies`
- Technologies: inline frequency slider (0–1, step 0.1) + comment per technology in a mission
