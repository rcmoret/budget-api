# Budget Application

A personal budgeting application built with Ruby on Rails and React for managing accounts, transactions, and budget intervals.

## Tech Stack

**Backend:**
- Ruby 3.2.5
- Rails 7.0.1
- PostgreSQL
- Devise (authentication)
- Inertia Rails (Rails/React integration)
- JWT (token authentication)
- Active Storage (file uploads)
- AWS S3 (storage backend)

**Frontend:**
- React 18
- TypeScript
- Inertia.js
- Vite (build tool)
- TailwindCSS (styling)
- D3.js (data visualization)
- React DatePicker

**Testing:**
- RSpec (backend)
- Jest (frontend)

## Prerequisites

- Ruby 3.2.5
- PostgreSQL
- Node.js and Yarn
- AWS credentials (for Active Storage in production)

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd budget
   ```

2. **Install Ruby dependencies**
   ```bash
   bundle install
   ```

3. **Install JavaScript dependencies**
   ```bash
   yarn install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your configuration:
   - Database credentials
   - AWS credentials (if using S3 for storage)
   - JWT secret key
   - Other environment-specific settings

5. **Set up the database**
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed  # Optional: seed with initial data
   ```

## Running the Application

### Development Mode

The application uses Overmind (or Foreman) to run multiple processes:

```bash
bin/dev
```

This will start:
- Rails server (Puma)
- Vite dev server

Alternatively, you can run each process separately:

**Rails server:**
```bash
rails server
```

**Vite dev server:**
```bash
bin/vite dev
```

**TailwindCSS (watch mode):**
```bash
yarn build:css:watch
```

The application will be available at `http://localhost:3000`

## Testing

### Backend Tests (RSpec)
```bash
bundle exec rspec
```

### Frontend Tests (Jest)
```bash
yarn test
```

## Code Quality

### Linting

**Ruby (RuboCop):**
```bash
bundle exec rubocop
```

**JavaScript/TypeScript (ESLint):**
```bash
yarn lint
```

**Format code (Prettier):**
```bash
yarn prettier --write .
```

## Project Structure

```
.
├── app/
│   ├── controllers/        # Rails controllers (API and web endpoints)
│   ├── models/             # ActiveRecord models
│   ├── serializers/        # JSON serialization logic
│   ├── lib/                # Business logic, forms, presenters
│   └── frontend/           # React application
│       ├── components/     # Reusable React components
│       ├── pages/          # Inertia.js page components
│       ├── lib/            # Frontend utilities and hooks
│       └── types/          # TypeScript type definitions
├── config/                 # Rails configuration
├── db/                     # Database migrations and schema
├── spec/                   # RSpec tests
└── public/                 # Static assets
```

## Key Features

- **Account Management**: Track multiple financial accounts
- **Transaction Tracking**: Record and categorize transactions with receipt uploads
- **Budget Planning**: Create and manage budget categories and intervals
- **Budget Intervals**: Set up recurring budget periods with maturity intervals
- **Transaction Categorization**: Assign transactions to budget categories
- **Visual Analytics**: Budget summary charts and data visualization
- **User Authentication**: Secure login with Devise and JWT tokens

## Development Workflow

1. Create a new feature branch
2. Make your changes
3. Run tests to ensure nothing breaks
4. Run linters and fix any issues
5. Commit your changes
6. Push and create a pull request

## Database Migrations

**Create a new migration:**
```bash
rails generate migration MigrationName
```

**Run migrations:**
```bash
rails db:migrate
```

**Rollback last migration:**
```bash
rails db:rollback
```

## Deployment

The application is configured for deployment with:
- PostgreSQL database
- AWS S3 for file storage (Active Storage)
- Environment-based credentials (Rails encrypted credentials)

Make sure to:
1. Set all required environment variables
2. Run database migrations
3. Precompile assets: `rails assets:precompile`
4. Configure your web server (e.g., Puma with reverse proxy)

## License

This is a personal project.
