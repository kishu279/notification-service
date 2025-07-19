# My Instagram Notification Service

A scalable notification service built with Turborepo, featuring a primary backend API and worker system for handling posts asynchronously using Redis queues.

## Architecture Overview

This monorepo contains a notification service with the following components:

- **Primary Backend**: Express.js API server that receives post requests and queues them in Redis
- **Worker**: Background service that processes posts from the Redis queue
- **WebSocket Service**: Real-time communication service (in development)
- **Shared Packages**: Common utilities and configurations

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `primary-backend`: Express.js API server that handles post creation and queues messages
- `worker`: Background worker that processes posts from Redis queue
- `websocket`: WebSocket server for real-time notifications (in development)
- `@repo/redis`: Shared Redis client configuration
- `@repo/eslint-config`: ESLint configurations
- `@repo/typescript-config`: TypeScript configurations used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Prerequisites

Before running this project, make sure you have:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) package manager
- [Redis](https://redis.io/) server running locally or accessible remotely

#### Install Redis

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

**macOS:**

```bash
brew install redis
brew services start redis
```

**Docker:**

```bash
docker run -d -p 6379:6379 redis:alpine
```

### Getting Started

1. **Clone and install dependencies:**

```bash
git clone <your-repo-url>
cd my-insta
pnpm install
```

2. **Start Redis server** (if not already running):

```bash
redis-server
```

3. **Development mode - Run all services:**

```bash
pnpm dev
```

4. **Or run specific services:**

**Primary Backend** (Port 6000):

```bash
pnpm dev --filter=primary-backend
```

**Worker**:

```bash
pnpm dev --filter=worker
```

**WebSocket** (Port 8080):

```bash
pnpm dev --filter=websocket
```

### API Usage

#### Create a Post

```bash
curl -X POST http://localhost:6000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "content": "Hello world!",
    "contentType": "text"
  }'
```

#### Health Check

```bash
curl http://localhost:6000/
```

### How it Works

1. **Primary Backend** receives POST requests at `/posts` endpoint
2. **Posts are queued** in Redis using `LPUSH` to the "posts" queue
3. **Worker processes** pick up messages from the queue using `BRPOP`
4. **WebSocket service** can notify connected clients about new posts (future implementation)

### Build

To build all apps and packages:

```bash
# With global turbo installed
turbo build

# Without global turbo
pnpm exec turbo build
```

Build specific package:

```bash
turbo build --filter=primary-backend
```

### Project Structure

```
my-insta/
├── apps/
│   ├── primary-backend/     # Express.js API server
│   ├── worker/              # Background job processor
│   └── websocket/           # WebSocket server
├── packages/
│   ├── redis/               # Shared Redis client
│   ├── eslint-config/       # ESLint configurations
│   └── typescript-config/   # TypeScript configurations
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

### Development

**Start development servers:**

```bash
pnpm dev
```

**Run specific app in development:**

```bash
pnpm dev --filter=primary-backend
pnpm dev --filter=worker
pnpm dev --filter=websocket
```

### Environment Variables

Create `.env` files in respective app directories if needed:

**apps/primary-backend/.env:**

```env
PORT=6000
REDIS_URL=redis://localhost:6379
```

**packages/redis/.env:**

```env
REDIS_URL=redis://localhost:6379
```

### Troubleshooting

**Redis Connection Issues:**

- Ensure Redis server is running: `redis-cli ping` should return `PONG`
- Check Redis logs: `sudo journalctl -u redis-server -f`
- Verify connection string in the Redis package

**Module Resolution Issues:**

- Run `pnpm install` from the root directory
- Ensure workspace dependencies are properly linked
- Check that `@repo/*` packages are listed in app dependencies

### Utilities

This Turborepo has additional tools setup:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Nodemon](https://nodemon.io/) for development auto-reload

### Future Enhancements

- [ ] WebSocket real-time notifications
- [ ] Database integration for post persistence
- [ ] Authentication and authorization
- [ ] Rate limiting and request validation
- [ ] Docker containerization
- [ ] Production deployment configurations

### Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting: `pnpm lint`
4. Build the project: `pnpm build`
5. Submit a pull request

## Useful Links

Learn more about the technologies used:

- [Turborepo Documentation](https://turborepo.com/docs)
- [Express.js](https://expressjs.com/)
- [Redis](https://redis.io/docs/)
