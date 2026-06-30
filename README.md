# Book Cover Bot

A full-stack web application for managing book cover printing operations. This application helps organize books, their cover editions, print formats, and job orders, with integrated PDF export functionality for print production.

## 🚀 Quick Start

Get up and running in 3 commands:

```bash
# Clone and enter directory
git clone https://github.com/rfeeney0614/book_cover_bot.git
cd book_cover_bot

# Start with Docker (recommended)
docker compose up --build

# In a new terminal, initialize database
docker compose exec web bundle exec rails db:create db:migrate db:seed
```

Then open http://localhost:3000 in your browser!

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
  - [Using Docker (Recommended)](#using-docker-recommended)
  - [Local Development Setup](#local-development-setup)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Architecture](#-architecture)
- [Development](#-development)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **Book Management**: Create, update, and search books with metadata (title, author, series, page count)
- **Cover Editions**: Manage multiple cover editions for each book with image uploads
- **Format Templates**: Define print formats with custom dimensions
- **Job Orders**: Queue covers for printing with quantity tracking
- **Print Queue**: View all pending print jobs in one consolidated view
- **Attention Items**: Track covers and books that need attention (missing images, formats, etc.)
- **PDF Export**: Generate print-ready PDFs with optimal layout packing
- **Background Processing**: Asynchronous PDF generation with progress tracking
- **Excel Export**: Export book data to Excel format
- **Search Functionality**: Full-text search across books, covers, and formats
- **Image Handling**: Upload and manage book cover images with thumbnail generation
- **Responsive UI**: Modern, book-themed interface built with React and Material-UI

## 🛠 Technology Stack

### Backend
- **Ruby** 3.3.6
- **Rails** ~> 8.0.0
- **PostgreSQL** 17 (production database)
- **SQLite** 3 (development/test database option)
- **Puma** web server
- **Solid Queue** for background job processing
- **Active Storage** for file uploads
- **Azure Blob Storage** for cloud file storage

### Backend Gems
- **hexapdf** - PDF generation and manipulation
- **rmagick** - Image processing
- **binpack** - Optimal layout algorithms for print exports
- **caxlsx** - Excel file generation
- **rack-cors** - Cross-origin resource sharing
- **mission_control-jobs** - Job monitoring UI

### Frontend
- **React** 19.2.0
- **React Router** ^6.14.1
- **Material-UI (MUI)** 7.3.5
- **React Icons** 5.5.0
- **Node.js** 18.x+
- **npm** 9.x+

### DevOps & Infrastructure
- **Docker** & Docker Compose
- **Heroku** deployment support
- **Kamal** for containerized deployment
- **Nginx** for frontend production serving

## 📦 Prerequisites

### For Docker Development
- Docker Desktop or Docker Engine (20.10+)
- Docker Compose (2.0+)

### For Local Development
- Ruby 3.3.6 (use rbenv or rvm)
- Node.js 18.x or higher
- npm 9.x or higher
- PostgreSQL 17 (or SQLite for development)
- ImageMagick (for image processing)
- Bundler gem

## 🚀 Installation

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/rfeeney0614/book_cover_bot.git
   cd book_cover_bot
   ```

2. **Set up environment variables**
   ```bash
   # Create .env file (optional, for sensitive data)
   cp .env.example .env  # if example exists
   # Or set directly in docker-compose.yml
   ```

3. **Build and start services**
   ```bash
   docker compose up --build
   ```

   This will start:
   - PostgreSQL database on port 5432
   - Rails API server on port 3000
   - Solid Queue background worker
   - (Optional) React dev server on port 3001 with `--profile dev-only`

4. **Create and migrate the database**
   ```bash
   docker compose exec web bundle exec rails db:create db:migrate db:seed
   ```

5. **Access the application**
   - Main application: http://localhost:3000
   - Job monitoring: http://localhost:3000/jobs
   - Frontend dev server (if using profile): http://localhost:3001

### Local Development Setup

#### Backend Setup

1. **Install Ruby dependencies**
   ```bash
   cd bookbot-api
   bundle install
   ```

2. **Set up the database**
   ```bash
   # For PostgreSQL
   bundle exec rails db:create db:migrate db:seed
   
   # For SQLite (development)
   RAILS_ENV=development bundle exec rails db:create db:migrate db:seed
   ```

3. **Start the Rails server**
   ```bash
   bundle exec rails server -p 3000
   ```

4. **Start the background job processor (in separate terminal)**
   ```bash
   bundle exec rake solid_queue:start
   ```

#### Frontend Setup

1. **Install Node dependencies**
   ```bash
   cd bookbot-frontend
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```
   The React app will start on http://localhost:3001 (or next available port)

3. **Build for production** (creates static files in `/build`)
   ```bash
   npm run build
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root or set these in your environment:

```bash
# Database
DATABASE_URL=postgres://postgres:<your_secure_password>@localhost:5432/book_bot
RAILS_MASTER_KEY=<your_master_key>
SECRET_KEY_BASE=<your_secret_key>

# Azure Blob Storage (optional, for cloud file storage)
AZURE_STORAGE_ACCOUNT_NAME=<your_account_name>
AZURE_STORAGE_ACCESS_KEY=<your_access_key>
AZURE_STORAGE_CONTAINER=<your_container_name>

# Rails Environment
RAILS_ENV=development
RACK_ENV=development

# Frontend API Connection
REACT_APP_API_HOST=localhost
REACT_APP_API_PORT=3000
```

### Master Key

Rails credentials are encrypted. To generate a new master key:

```bash
cd bookbot-api
EDITOR=nano bundle exec rails credentials:edit
```

### Database Configuration

The app supports both PostgreSQL (production) and SQLite (development). Configure in `bookbot-api/config/database.yml`.

## 💻 Usage

### Basic Workflow

1. **Create Formats** (optional, if not using defaults)
   - Navigate to Formats → New Format
   - Define dimensions (e.g., 6" x 9" paperback)
   - Set as default if needed

2. **Add Books**
   - Navigate to Books → New Book
   - Enter title, author, series, page count, and notes
   - Save the book

3. **Create Covers**
   - From a book's detail page, click "New Cover"
   - Upload cover image
   - Select format and edition name
   - Add notes if needed

4. **Create Job Orders**
   - From the Print Queue or Cover detail page
   - Add covers to the print queue with quantities
   - Adjust quantities as needed

5. **Generate Print Export**
   - Navigate to Print Exports → New Export
   - The system generates an optimized PDF for printing
   - Monitor progress in the Print Exports list
   - Download the PDF when complete

### Searching

Use the search bar on index pages to find:
- Books by title, author, or series
- Covers by edition name or book title
- Formats by name

### Attention Items

Check the "Attention" page to see items needing review:
- Books without covers
- Covers without images
- Covers without assigned formats

## 📚 API Documentation

All API endpoints are prefixed with `/api/`

### Books

- `GET /api/books` - List all books (with pagination and search)
- `GET /api/books/:id` - Show book details
- `POST /api/books` - Create a new book
- `PATCH /api/books/:id` - Update a book
- `GET /api/books/export` - Export books to Excel

### Covers

- `GET /api/covers` - List all covers (with pagination and search)
- `GET /api/covers?book_id=:id` - List covers for a specific book
- `GET /api/covers/:id` - Show cover details
- `POST /api/covers` - Create a new cover (with image upload)
- `PATCH /api/covers/:id` - Update a cover
- `DELETE /api/covers/:id` - Delete a cover

### Formats

- `GET /api/formats` - List all formats
- `GET /api/formats/:id` - Show format details
- `POST /api/formats` - Create a new format
- `PATCH /api/formats/:id` - Update a format
- `DELETE /api/formats/:id` - Delete a format

### Job Orders

- `GET /api/job_orders` - List all job orders
- `GET /api/job_orders/:id` - Show job order details
- `POST /api/job_orders` - Create a new job order
- `PATCH /api/job_orders/:id/increment` - Increment quantity
- `PATCH /api/job_orders/:id/decrement` - Decrement quantity
- `DELETE /api/job_orders/:id` - Delete a job order

### Print Exports

- `GET /api/print_exports` - List all print exports
- `GET /api/print_exports/:id` - Show export details
- `POST /api/print_exports` - Create a new export
- `GET /api/print_exports/:id/status` - Check export status
- `GET /api/print_exports/:id/download` - Download PDF
- `DELETE /api/print_exports/:id` - Delete an export

### Other Endpoints

- `GET /api/print_queue` - View all pending print jobs
- `GET /api/attention` - Get items needing attention

## 🏗 Architecture

### Application Structure

```
book_cover_bot/
├── bookbot-api/              # Rails backend
│   ├── app/
│   │   ├── controllers/api/  # API controllers
│   │   ├── models/           # ActiveRecord models
│   │   ├── jobs/             # Background jobs
│   │   └── views/            # (minimal, API-only)
│   ├── config/               # Rails configuration
│   ├── db/                   # Database migrations & schema
│   └── public/               # Serves React build (production)
├── bookbot-frontend/         # React frontend
│   ├── src/
│   │   ├── api/              # API client functions
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   └── App.js            # Main app component
│   ├── public/               # Static assets
│   └── build/                # Production build output
├── docker-compose.yml        # Multi-container orchestration
├── Dockerfile                # Rails container definition
└── Procfile                  # Heroku process definition
```

### Data Model

- **Book**: Core entity with title, author, series, page count
- **Cover**: Belongs to Book, has image attachment, format, edition
- **Format**: Print format template (dimensions)
- **JobOrder**: Links Cover with quantity for printing
- **PrintExport**: Groups JobOrders, generates PDF via background job

### Background Jobs

The application uses Solid Queue for job processing:
- **CompileExportJob**: Generates optimized PDFs from job orders using bin packing algorithms

### File Storage

- Development: Local Active Storage
- Production: Azure Blob Storage (configurable)
- Images: Stored with variants (thumbnails)
- PDFs: Generated and attached to PrintExport records

## 🔧 Development

### Running Tests

```bash
cd bookbot-api
bundle exec rails test
bundle exec rails test:system

cd ../bookbot-frontend
npm test
```

### Linting

```bash
# Ruby
cd bookbot-api
bundle exec rubocop

# JavaScript
cd bookbot-frontend
npm run lint  # if configured
```

### Database Management

```bash
# Create migration
cd bookbot-api
bundle exec rails generate migration MigrationName

# Run migrations
bundle exec rails db:migrate

# Rollback
bundle exec rails db:rollback

# Reset database
bundle exec rails db:reset

# Seed data
bundle exec rails db:seed
```

### Adding Dependencies

```bash
# Ruby gems
cd bookbot-api
bundle add gem_name

# Node packages
cd bookbot-frontend
npm install --save package_name
```

### Debugging

- **Rails Console**: `bundle exec rails console`
- **Job Monitoring**: Visit http://localhost:3000/jobs
- **Logs**: Check `bookbot-api/log/development.log`
- **React DevTools**: Install browser extension

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes in appropriate directory (backend/frontend)
3. Test locally using Docker or local servers
4. Commit changes: `git commit -m "Description"`
5. Push: `git push origin feature/your-feature`
6. Create pull request

## 🚀 Deployment

### Heroku Deployment

1. **Prerequisites**
   - Heroku account and CLI installed
   - PostgreSQL addon

2. **Deploy**
   ```bash
   heroku create your-app-name
   # Check available PostgreSQL plans: heroku addons:plans heroku-postgresql
   heroku addons:create heroku-postgresql:essential-0
   git push heroku main
   heroku run bundle exec rails db:migrate
   heroku run bundle exec rails db:seed
   ```

3. **Environment Variables**
   ```bash
   heroku config:set RAILS_MASTER_KEY=<your_key>
   heroku config:set SECRET_KEY_BASE=<your_key>
   ```

4. **Scale Workers**
   ```bash
   heroku ps:scale web=1 worker=1
   ```

### Docker Production Build

```bash
# Build production image
docker build -t book-cover-bot .

# Run container
docker run -d \
  -p 80:80 \
  -e RAILS_MASTER_KEY=<your_key> \
  -e DATABASE_URL=<your_db_url> \
  --name book-cover-bot \
  book-cover-bot
```

### Kamal Deployment

The app includes Kamal configuration for containerized deployment:

```bash
# Setup
kamal setup

# Deploy
kamal deploy

# Check status
kamal app details
```

## 🔍 Troubleshooting

### Common Issues

#### Docker Issues

**Problem**: `Error: Cannot connect to the Docker daemon`
```bash
# Solution: Ensure Docker is running
sudo systemctl start docker  # Linux
# Or start Docker Desktop on Mac/Windows
```

**Problem**: Port 3000 or 5432 already in use
```bash
# Solution: Change ports in docker-compose.yml or stop conflicting services
docker compose down
sudo lsof -i :3000  # Find process using port
sudo kill -9 <PID>  # Kill the process
```

**Problem**: Database connection errors
```bash
# Solution: Ensure database is created and migrated
docker compose exec web bundle exec rails db:create db:migrate
```

#### Rails Issues

**Problem**: `ActiveRecord::PendingMigrationError`
```bash
# Solution: Run pending migrations
bundle exec rails db:migrate
```

**Problem**: Missing master key
```bash
# Solution: Generate or obtain the master key
# Either get it from your team or regenerate:
bundle exec rails credentials:edit
```

**Problem**: ImageMagick not installed (for local development)
```bash
# Solution: Install ImageMagick
# Mac:
brew install imagemagick

# Ubuntu/Debian:
sudo apt-get install imagemagick libmagickwand-dev

# Windows: Download from https://imagemagick.org/
```

#### Frontend Issues

**Problem**: `Module not found` errors
```bash
# Solution: Reinstall dependencies
cd bookbot-frontend
rm -rf node_modules package-lock.json
npm install
```

**Problem**: React app can't connect to API
```bash
# Solution: Check REACT_APP_API_HOST and REACT_APP_API_PORT
# Also verify CORS is configured in Rails (rack-cors gem)
```

**Problem**: Build fails with memory error
```bash
# Solution: Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

#### Background Job Issues

**Problem**: Jobs not processing
```bash
# Solution: Ensure Solid Queue worker is running
bundle exec rake solid_queue:start

# Or check worker in Docker:
docker compose logs solid_queue_worker
```

**Problem**: Job stuck in "processing" state
```bash
# Solution: Check Mission Control Jobs dashboard
# Visit http://localhost:3000/jobs
# Or check logs for errors
```

### Getting Help

If you encounter issues not listed here:
1. Check the application logs (`bookbot-api/log/development.log`)
2. Review Docker logs (`docker compose logs`)
3. Search existing GitHub issues
4. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Docker version, etc.)

## 📝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Ruby: Follow RuboCop Rails Omakase style guide
- JavaScript/React: Follow Airbnb style guide (or configured ESLint rules)
- Commit messages: Use conventional commits format

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with Ruby on Rails and React
- Uses Material-UI for component library
- Powered by HexaPDF for PDF generation
- Background jobs by Solid Queue

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing issues and documentation
- Review the WORK_IN_PROGRESS.md for current development status

---

**Note**: This application is under active development. Check WORK_IN_PROGRESS.md for current features and planned updates.
