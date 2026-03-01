# Segmentation API

HTTP API that evaluates user segmentation rules. Send a user document and a set of SQL-style rules; the API returns which segments the user belongs to.

## Tech stack

- **Node.js** + **Express**
- **TypeScript**
- **better-sqlite3** (in-memory) for evaluating segment rules as SQL `WHERE` predicates
- **dotenv** for configuration (e.g. `PORT`)

## Quick start

```bash
# Install dependencies
npm install

# Optional: set port via .env (copy from .env.example)
# PORT=3000

# Development (with ts-node)
npm run dev

# Production
npm run build
npm start
```

Server runs on `http://localhost:3000` by default. Port can be set with the `PORT` environment variable or in a `.env` file.

## API

### `GET /evaluate`

Serves the test UI (HTML) so you can run the test suite in the browser.

### `POST /evaluate`

Evaluates segment rules against a user.

**Request body:**

```json
{
  "user": {
    "id": "user-123",
    "level": 12,
    "country": "Turkey",
    "first_session": 1672531200,
    "last_session": 1735689600,
    "purchase_amount": 15000,
    "last_purchase_at": 1735600000
  },
  "segments": {
    "high_level": "level > 10",
    "turkish_spenders": "country = 'Turkey' and purchase_amount >= 10000",
    "recent_players": "last_session > _now() - 24*60*60"
  }
}
```

**Response (200):**

```json
{
  "results": {
    "high_level": true,
    "turkish_spenders": true,
    "recent_players": false
  }
}
```

Segment rules are SQL `WHERE`-style expressions. The special function `_now()` returns the current Unix timestamp in seconds.

## Docker

```bash
docker build -t segmentation-api .
docker run -e PORT=3000 -p 3000:3000 segmentation-api
```

Then open `http://localhost:3000/evaluate` to run the test suite.

## Project structure

```
src/
  index.ts      # Express app, routes, PORT from env
  routes.ts     # POST /evaluate handler
  validator.ts  # Request validation
  evaluator.ts  # Segment evaluation via SQLite
  types.ts      # User & request types
public/
  test.html     # Test UI
```

## License

ISC
