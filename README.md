# 2026 Internship Homework

## Overview

Build an HTTP server that evaluates user segment rules. You may use any programming language and LLM usage is encouraged.

### What is User Segmentation?

User segmentation is how companies group their users based on behavior or attributes. For example, an e-commerce app might define segments like:

- **"Payers"** — users who spent more than $100
- **"Inactive Users"** — users who haven't logged in for 30 days
- **"New Players"** — users who signed up in the last week

Your server receives a user's data and a set of segment rules, then determines which segments the user belongs to. This is commonly used for targeted notifications, promotions, and analytics.

## Specification

### User Document

A user document has the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | string | User identifier |
| level | integer | User level |
| country | string | Country name (e.g., "Turkey", "United States", "Japan") |
| first_session | integer | Unix timestamp in seconds |
| last_session | integer | Unix timestamp in seconds |
| purchase_amount | integer | Amount in cents |
| last_purchase_at | integer | Unix timestamp in seconds |

- Field names in the user document are case-sensitive
- Field values cannot be null
- Numeric fields are non-negative integers
- String fields cannot be empty

### Segment Rules

Segment rules are SQL WHERE predicates. Any ANSI SQL operator is supported. SQL keywords are case-insensitive; string values are case-sensitive.

Segment rules can contain a special function `_now()`. The `_now()` function returns the current Unix timestamp in seconds. You must implement this function in your server.

Examples:

```sql
level > 10
```

```sql
country = 'Turkey' and level >= 5
```

```sql
last_purchase_at > _now() - 24*60*60
```

```sql
last_purchase_at > _now() - 7*24*60*60 and purchase_amount >= 10000
```

### API

Your server **must** implement two endpoints:

#### `GET /evaluate`

Serves the `test.html` file included in your assignment.

#### `POST /evaluate`

Evaluates segment rules against a user document.

**Request:**
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

**Response (200 OK):**
```json
{
  "results": {
    "high_level": true,
    "turkish_spenders": true,
    "recent_players": false
  }
}
```

**Error Response (400 Bad Request):**

Return this when the request has invalid JSON, missing fields, null field values, unknown field in segment rule, or invalid SQL syntax.

```json
{
  "error": "description of the error"
}
```

> [!NOTE]
> The specification is intentionally not overly exhaustive. How you handle ambiguity is part of the assignment.

## Testing

1. Start your server on port 3000
2. Open http://localhost:3000/evaluate in your browser
3. All tests should pass

You can also test manually with curl:

```bash
# Basic comparison
curl -X POST http://localhost:3000/evaluate \
  -H "Content-Type: application/json" \
  -d '{"user": {"id": "u1", "level": 5, "country": "Japan", "first_session": 1700000000, "last_session": 1700000000, "purchase_amount": 0, "last_purchase_at": 0}, "segments": {"is_beginner": "level <= 5"}}'
# Expected: {"results": {"is_beginner": true}}

# Case sensitivity
curl -X POST http://localhost:3000/evaluate \
  -H "Content-Type: application/json" \
  -d '{"user": {"id": "u2", "level": 10, "country": "Turkey", "first_session": 1700000000, "last_session": 1700000000, "purchase_amount": 5000, "last_purchase_at": 1700000000}, "segments": {"turkish": "country = '\''Turkey'\''", "turkish_lowercase": "country = '\''turkey'\''"}}'
# Expected: {"results": {"turkish": true, "turkish_lowercase": false}}

# Multiple conditions
curl -X POST http://localhost:3000/evaluate \
  -H "Content-Type: application/json" \
  -d '{"user": {"id": "u3", "level": 20, "country": "United States", "first_session": 1600000000, "last_session": 1700000000, "purchase_amount": 25000, "last_purchase_at": 1700000000}, "segments": {"high_spender": "level >= 15 AND purchase_amount > 20000"}}'
# Expected: {"results": {"high_spender": true}}
```

## Submission

### 1. Create a Dockerfile

Create a file named `Dockerfile` (no extension) in your **project root**. This file tells us how to build and run your solution.

Your server must read the port from the `PORT` environment variable. We will run your solution like this:

```bash
docker build -t solution .
docker run -e PORT=3000 -p 3000:3000 solution
```

### 2. Share your LLM transcript

If you used an LLM at any point, include the **full conversation transcript** under `transcripts/` directory.

If you use **Cursor** IDE, **Export Transcript** option can be found under the chat menu.

If you use any other IDE or tool, find its transcript export option and include the output. If no export exists, copy and paste the full conversation into a text file and put it under the `transcripts/` directory.

### 3. Send your solution

Create a zip file of your project and send it to `yildiz@peak.com` as an attachment. If the zip file exceeds the email size limit, upload it to Google Drive and share the link in the email body.

> [!IMPORTANT]
> Your submission **must** include the `Dockerfile` in the project root. If you used an LLM, you **must** also include the `transcripts/` directory with your conversation logs. Submissions missing the `Dockerfile`, or missing transcripts when an LLM was used, will be considered incomplete.


## Evaluation

The Big Data team will:

1. **Build your Docker image** using your `Dockerfile`
2. **Run your server** with a specified `PORT` environment variable
3. **Execute the test suite** against your server
4. **Review your code** — we look at code quality, structure, and proper formatting
5. **Ask you to explain your code** — you should be able to walk through any part of your submission, whether you wrote it by hand or with the help of an LLM

You are expected to understand and explain every line of code you submit. Using an LLM is encouraged, but the code is yours to defend.
