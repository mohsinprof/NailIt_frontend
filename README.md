# AI Interview Coach — Frontend

React + Vite frontend for an AI-powered interview preparation platform.
It pairs with the backend repo (`genai_backend`), which serves the REST API.

## Features

- **Auth** — register, login, logout with httpOnly-cookie sessions (`Protected` route guard)
- **AI Interview Reports** — upload a resume PDF and/or self description + job description,
  get an AI-generated report: match score, skill gaps, technical & behavioral questions,
  preparation plan
- **Report history** — latest reports on the Home page, with per-report delete (✕)
- **Tailored resume PDF** — download an AI-tailored resume from any report
- **Make Fresh Resume** — fill a form or upload an existing PDF; AI generates a
  professional resume as a downloadable PDF
- **My Resumes library** — save up to 3 resume PDFs (from generation flows or upload),
  browse/download/delete them on the Home page; when storage is full a
  replace-picker modal lets you overwrite an existing slot

## Tech stack

- React 19 + Vite 8
- react-router 7 (`createBrowserRouter`, protected routes)
- SCSS (per-feature stylesheets)
- axios (`withCredentials` — cookie-based auth)
- lucide-react icons

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
```

> The backend must be running on `http://localhost:3000` (see the backend repo).
> The API base URL is configured in each service file under
> `src/features/*/services/*.api.js` — update those when deploying.

## Project structure

```
src/
├── main.jsx                    # entry — AuthProvider → RouterProvider
├── app.routes.jsx              # route table (Protected routes)
├── style.scss                  # global theme
├── features/
│   ├── auth/                   # pages, context, hooks, Layout
│   ├── interview/              # Home, Interview report, hooks, services, styles
│   ├── makeFreshResume/        # resume builder form + service
│   └── savedResumes/           # ISOLATED FEATURE: library panel, replace modal, API, styles
└── assets/                     # static images
```

## Feature isolation & rollback

The **saved resumes** feature is deliberately self-contained: all of its code lives in
`src/features/savedResumes/`, and every integration point in existing pages
(`Home.jsx`, `MakeFreshResume.jsx`, `Interview.jsx`) is wrapped in
`=== SAVED RESUMES FEATURE ===` comment markers — delete the folder and the marked
blocks to remove the feature with zero side effects.
