# Enhanced JSONPlaceholder API

A robust backend API that replicates the behavior of JSONPlaceholder with added features like authentication, database persistence, and containerized deployment.

## Features

- Full REST API implementation
- JWT-based authentication
- PostgreSQL database with Prisma ORM
- Input validation
- Docker containerization
- TypeScript support
- Comprehensive error handling

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- PostgreSQL (if running locally)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd jsonplaceholder-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following content:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jsonplaceholder?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="1d"
PORT=3000
NODE_ENV=development
```

4. Start the development environment:
```bash
# Using Docker Compose (recommended)
docker-compose up

# Or run locally
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and get JWT token

### Users

- `GET /api/users` - Get all users (requires authentication)
- `GET /api/users/:id` - Get a specific user (requires authentication)
- `POST /api/users` - Create a new user (public)
- `PUT /api/users/:id` - Update a user (requires authentication)
- `DELETE /api/users/:id` - Delete a user (requires authentication)

### Health Check

- `GET /health` - Check API health status

## Development

### Database Migrations

```bash
# Generate Prisma client
npm run prisma:generate

# Create a new migration
npm run prisma:migrate

# Seed the database
npm run prisma:seed
```

### Testing

```bash
# Run tests
npm test
```

### Building for Production

```bash
# Build the application
npm run build

# Start in production mode
npm start
```

## Docker Deployment

The application is containerized using Docker and Docker Compose. The setup includes:

- Node.js application container
- PostgreSQL database container
- Volume for persistent data storage
- Environment variable configuration

To deploy:

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## Data Model

The API implements the following data model:

```typescript
interface Geo {
  lat: string;
  lng: string;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}
```

## Security

- JWT-based authentication
- Password hashing using bcrypt
- Input validation and sanitization
- CORS enabled
- Environment variable configuration
- Secure password storage

## Error Handling

The API implements comprehensive error handling:

- Input validation errors
- Authentication errors
- Database errors
- General server errors

All errors are returned in a consistent JSON format:

```json
{
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT 