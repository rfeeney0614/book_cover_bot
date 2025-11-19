Conversation savepoint — Book Cover Bot
Date: 2025-11-18
Branch: move_to_react

Summary
- Migrated Rails app into `bookbot-api/` and frontend into `bookbot-frontend/`.
- Resolved many Docker/npm issues; frontend uses `node:20-alpine` and regenerated `package-lock.json`.
- Implemented React scaffolding for Books and Covers, and added Formats, JobOrders, PrintExports scaffolding (pages, components, API helpers).
- Added API namespace controllers: `Api::BooksController`, `Api::CoversController`, `Api::FormatsController`, `Api::JobOrdersController`, `Api::PrintExportsController`.
- Added specialized endpoints: `/api/print_exports/:id/status` and `/api/print_exports/:id/download`.
- `PrintExport` stores files via ActiveStorage (`has_one_attached :pdf`). The download endpoint now redirects to the ActiveStorage blob URL (`rails_blob_url(..., disposition: 'attachment')`).

Files added/changed (high level)
- Frontend (`bookbot-frontend/src/`):
  - `App.js` (new routes)
  - `api/` helpers: `formats.js`, `job_orders.js`, `print_exports.js`
  - `pages/`: `FormatsIndex.jsx`, `FormatShow.jsx`, `JobOrdersIndex.jsx`, `JobOrderShow.jsx`, `PrintExportsIndex.jsx`, `PrintExportShow.jsx`
  - `components/` for formats, job orders, print exports
- Backend (`bookbot-api/`):
  - `config/routes.rb` (API routes for covers, formats, job_orders, print_exports)
  - `app/controllers/api/*_controller.rb` for formats, covers, job_orders, print_exports (CRUD)

Outstanding / Blockers
- Propshaft/Tailwind asset missing error (runtime) — development workaround: run tailwind build/watch or `bin/rails tailwindcss:build`. This is independent from the API scaffolding and can be addressed later.
- Verify ActiveStorage host configuration if downloads redirect to absolute URLs inside Docker. Consider setting `Rails.application.routes.default_url_options[:host]` in `config/environments/development.rb` when running inside Docker.

Commands to resume development (PowerShell)
- Start Docker Compose (web + frontend):
  cd 'C:\Users\Feeney Clan\git\book_cover_bot'
  docker compose up --build

- Start frontend dev locally (alternative):
  cd 'C:\Users\Feeney Clan\git\book_cover_bot\bookbot-frontend'
  npm install
  npm start

- Start Rails server locally (alternative):
  cd 'C:\Users\Feeney Clan\git\book_cover_bot\bookbot-api'
  bin/rails server

Quick checks to run after starting stack
- Visit frontend: http://localhost:3001 (or container mapping)
- Test API endpoints: GET http://localhost:3000/api/formats.json, /api/covers.json, /api/print_exports.json
- Test export download: create a PrintExport with a `pdf` attached and click Download on the frontend; Rails should redirect to the blob URL.

Next suggested tasks (pick one when you return)
- Run frontend dev server and verify pages compile.
- Run Rails and confirm API endpoints return JSON.
- Fix Propshaft/Tailwind missing asset (run `bin/rails tailwindcss:build` or `bin/dev`).
- Add direct upload support for `PrintExport#pdf` (ActiveStorage direct upload flow) if you want uploads from the SPA.

Notes
- I updated the tracked todo list inside the workspace while we worked. The remaining step is to run lint/format if you want me to run and fix JS lint issues.

When you're back, tell me which task to pick next and I'll continue from this savepoint.
