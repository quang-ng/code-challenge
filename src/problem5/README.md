## Problem 5 — Express + TypeScript CRUD (Postgres + Prisma)

This is a minimal backend server using ExpressJS and TypeScript. It exposes CRUD APIs for an `Item` resource and persists data in Postgres via Prisma ORM, structured with clean architecture and dependency inversion.

### Architecture
Clean architecture separates concerns and inverts dependencies. High‑level policy (use cases, domain) does not depend on low‑level details (frameworks, databases).

- Layers
  - Entry points: `src/index.ts`, `src/routes/*` — HTTP transport only; translate HTTP ↔ application.
  - Use cases: `src/usecases/*` — Application logic orchestrating gateways. Pure and testable.
  - Domain: `src/domain/entities/*`, `src/domain/gateways/*` — Entities and abstract interfaces.
  - Infrastructure: `src/infrastructure/*` — Adapters implementing gateways (e.g., Prisma).
  - Composition: `src/app/container.ts` — Wires adapters to interfaces and instantiates use cases.

- Gateways
  - `DataGateway`: persistence abstraction (swap Prisma/Postgres, Mongo, etc.).
  - `ApiGateway`: outbound HTTP abstraction.
  - `CacheGateway`: caching abstraction.

- Extensibility
  - Add new transports (HTTP, listeners, gRPC) that reuse the same use cases.
  - Swap infrastructure by providing a new adapter without touching use cases or routes.

Note: The legacy `src/db.ts` was removed in favor of `PrismaDataGateway` and DI in `app/container.ts`.

### Quickstart
1) Install
```bash
cd src/problem5
npm install
```

2) Configure environment
```bash
cp .env.example .env
```

3) Run in development
```bash
npm run dev
```
API default: `http://localhost:3000`

### Database with Docker
Start Postgres via Docker Compose:
```bash
docker compose up -d
```

Example `.env` (Compose network host `db`):
```env
PORT=3000
DATABASE_URL=postgresql://appuser:password@db:5432/appdb?schema=public
```

### Prisma
Generate client, run migrations, seed data:
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

### Project Structure
```
src/problem5/
  ├─ package.json
  ├─ tsconfig.json
  ├─ README.md
  ├─ docker-compose.yml     # Postgres + API services
  ├─ Dockerfile             # API container image
  ├─ jest.config.ts
  ├─ prisma/
  │  ├─ schema.prisma
  │  └─ seed.ts
  └─ src/
     ├─ index.ts
     ├─ app/
     │  └─ container.ts
     ├─ domain/
     │  ├─ entities/Item.ts
     │  └─ gateways/
     │     ├─ DataGateway.ts
     │     ├─ ApiGateway.ts
     │     └─ CacheGateway.ts
     ├─ usecases/
     │  └─ items/
     │     ├─ CreateItem.ts
     │     ├─ ListItems.ts
     │     ├─ GetItem.ts
     │     ├─ UpdateItem.ts
     │     └─ DeleteItem.ts
     ├─ infrastructure/
     │  └─ prisma/
     │     └─ PrismaDataGateway.ts
     └─ routes/
        └─ items.ts
```

### API Endpoints
Base URL: `http://localhost:3000`

- `GET /health` — health check
- `POST /items` — create an item
  - Body:
    ```json
    { "name": "string", "description": "string|null", "tags": ["tag1", "tag2"] }
    ```
- `GET /items` — list items with filters
  - Query params: `q`, `tag`, `createdBefore`, `createdAfter` (ISO), `limit` (1..100), `offset` (>=0)
- `GET /items/:id` — get item by id
- `PUT /items/:id` — update item (any subset of fields)
- `DELETE /items/:id` — delete item

#### Example cURL
```bash
# Create
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"First item","description":"demo","tags":["demo","test"]}'

# List (search by name containing "First")
curl "http://localhost:3000/items?q=First&limit=10"

# Get by id
curl http://localhost:3000/items/1

# Update
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"description":"updated","tags":["updated"]}'

# Delete
curl -X DELETE http://localhost:3000/items/1 -i
```

### Build and Run
```bash
npm run build      # compile TS and generate Prisma client
npm start          # start built app
```

### Docker
API image (expects a reachable Postgres):
```bash
docker build -t problem5-api .
docker run --rm -p 3000:3000 \
  -e DATABASE_URL="postgresql://appuser:password@host.docker.internal:5432/appdb?schema=public" \
  problem5-api
```

Docker Compose (API + Postgres):
```bash
docker compose up --build
docker compose down
```

### Testing
Run integration tests (requires a Postgres reachable via `DATABASE_URL`):
```bash
npm test
```
