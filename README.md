# MetaPhoto

A photo library application built for the MetaPhoto technical test. It provides an enriched photo API (backend) and a browsable SPA (frontend).

## Live Demo

> After deploying to Vercel, add your URL here.

---

## Project Structure

```
metaphoto/
├── backend/          # Node.js + Express API
│   └── src/
│       ├── index.ts
│       ├── routes/photos.ts
│       └── services/dataService.ts
├── frontend/         # React SPA
│   └── src/
│       ├── App.tsx
│       └── components/
├── .github/
│   └── workflows/deploy.yml   # CI/CD via GitHub Actions → Vercel
├── vercel.json
└── README.md
```

---

## Features

### Part 1 — API Endpoint

**`GET /externalapi/photos/:id`**
Returns a single photo enriched with its album and user data.

**`GET /externalapi/photos`**
Returns a paginated, filterable list of enriched photos.

#### Filters (query params)
| Param | Match type | Example |
|---|---|---|
| `title` | contains | `?title=accusamus` |
| `album.title` | contains | `?album.title=quidem` |
| `album.user.email` | equals | `?album.user.email=Sincere@april.biz` |

Multiple filters can be combined.

#### Pagination
| Param | Default | Description |
|---|---|---|
| `limit` | 25 | Max items to return |
| `offset` | 0 | Starting index |

Example: `/externalapi/photos?album.title=quidem&limit=10&offset=50`

Response shape:
```json
{
  "total": 100,
  "limit": 10,
  "offset": 50,
  "data": [...]
}
```

### Part 2 — Web Application

- Browse all photos in a responsive grid
- Filter by photo title, album title, or user email
- Click any photo for a full detail modal
- Paginated navigation with configurable page size (10, 25, 50, 100)

---

## Running Locally

### Prerequisites
- Node.js >= 18

### 1. Install dependencies

```bash
# From repo root
npm run install:all
```

### 2. Start the backend

```bash
npm run dev:backend
# API runs on http://localhost:3001
```

### 3. Start the frontend

```bash
npm run dev:frontend
# App runs on http://localhost:3000
# Proxies /externalapi/* to localhost:3001
```

---

## Deployment — Vercel

This project is configured for Vercel's monorepo support via `vercel.json`. The backend runs as a serverless function and the frontend is served as a static build.

### One-time setup

1. Install Vercel CLI: `npm i -g vercel`
2. From the repo root: `vercel`  — follow the prompts
3. Set the environment variable in Vercel dashboard:
   - `REACT_APP_API_URL` → your Vercel deployment URL (e.g. `https://metaphoto.vercel.app`)

### CI/CD (GitHub Actions)

On every push to `main`, the workflow in `.github/workflows/deploy.yml`:
1. Installs dependencies for both backend and frontend
2. Builds the React app
3. Deploys to Vercel (production)

Pull requests get a preview deployment automatically.

#### Required GitHub Secrets

| Secret | Where to get it |
|---|---|
| `VERCEL_TOKEN` | vercel.com → Account Settings → Tokens |
| `VERCEL_ORG_ID` | `.vercel/project.json` after running `vercel` locally |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` after running `vercel` locally |
| `REACT_APP_API_URL` | Your Vercel project URL |

---

## Tools Used

| Tool | Purpose |
|---|---|
| Node.js 20 | JavaScript runtime |
| Express 4 | HTTP server / routing |
| axios | HTTP client for upstream API calls |
| node-cache | In-memory caching of upstream data (5 min TTL) |
| React 18 | Frontend SPA framework |
| create-react-app | Frontend project scaffolding |
| Vercel | Hosting (serverless backend + static frontend) |
| GitHub Actions | CI/CD pipeline |

---

## Notes

- Upstream data from `jsonplaceholder.typicode.com` is cached in memory for 5 minutes to avoid redundant network calls on every request.
- All three data sets (users, albums, photos) are fetched in parallel using `Promise.all` and joined in memory.
