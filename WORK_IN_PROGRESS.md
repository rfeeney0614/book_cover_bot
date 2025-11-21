Conversation savepoint — Book Cover Bot
Date: 2025-11-18
Branch: move_to_react

Summary

Files added/changed (high level)
  - `App.js` (new routes)
  - `api/` helpers: `formats.js`, `job_orders.js`, `print_exports.js`
  - `pages/`: `FormatsIndex.jsx`, `FormatShow.jsx`, `JobOrdersIndex.jsx`, `JobOrderShow.jsx`, `PrintExportsIndex.jsx`, `PrintExportShow.jsx`
  - `components/` for formats, job orders, print exports
  - `config/routes.rb` (API routes for covers, formats, job_orders, print_exports)
  - `app/controllers/api/*_controller.rb` for formats, covers, job_orders, print_exports (CRUD)

Outstanding / Blockers

Commands to resume development (PowerShell)
  cd 'C:\Users\Feeney Clan\git\book_cover_bot'
  docker compose up --build

  cd 'C:\Users\Feeney Clan\git\book_cover_bot\bookbot-frontend'
  npm install
  npm start

  cd 'C:\Users\Feeney Clan\git\book_cover_bot\bookbot-api'
  bin/rails server

Quick checks to run after starting stack

Next suggested tasks (pick one when you return)

Notes

When you're back, tell me which task to pick next and I'll continue from this savepoint.

2025-11-19 Progress Update
- Added `note` field to Cover model and API, confirmed migration and param whitelisting.
- Updated frontend: CoverForm now supports format selection (FormatSelect), note, edition, and book selection.
- Covers without images now show a missing image icon (react-icons, CoverImage component).
- Fixed Docker Compose frontend build issues: node_modules volume reset, BROWSER=none, confirmed react-icons/react-scripts present in container.
- All containers rebuilt and running; frontend and backend compile and serve assets.
- Next up: print queue feature (to be tackled tomorrow).
