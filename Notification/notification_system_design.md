# Notification System Design

## Overview

This is a full-stack notification system built as part of a placement assignment. The project is split into three main parts — a logging middleware package, a backend application, and a frontend application. Each part lives in its own folder inside this repository.

---

## Project Structure

```
Notification/
├── logging_middleware/         # Reusable logging package used by both BE and FE
├── notification_app_be/        # Backend application (Node.js / Express + TypeScript)
├── notification_app_fe/        # Frontend application (React + TypeScript + Vite)
├── notification_system_design.md   # This file — documents the entire system
└── .gitignore
```

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React, TypeScript, Vite           |
| Backend    | Node.js, Express, TypeScript      |
| Styling    | Vanilla CSS / Material UI         |
| Logging    | Custom reusable logging middleware |

---

## Pre-Setup

### Registration

To get access to the test server, a one-time registration was done via the following API:

**Endpoint:** `POST http://20.207.122.201/evaluation-service/register`

**Request Body:**
```json
{
  "email": "<college-email>",
  "name": "<name>",
  "mobileNo": "<mobile>",
  "githubUsername": "<github-username>",
  "rollNo": "<roll-number>",
  "accessCode": "<access-code>"
}
```

**Response:**
```json
{
  "email": "dhruv1187.be23@chitkarauniversity.edu.in",
  "name": "dhruv dalal",
  "rollNo": "2311981187",
  "accessCode": "EXfvDp",
  "clientID": "04142122-3dff-48fa-861d-c8463aeee15e",
  "clientSecret": "hKGaQXMuptuNZwuh"
}
```

> Registration was done once. The `clientID` and `clientSecret` above are the actual saved credentials.

---

### Authentication

After registration, an authorization token is needed to call any protected API on the test server.

**Endpoint:** `POST http://20.207.122.201/evaluation-service/auth`

**Request Body:**
```json
{
  "email": "<college-email>",
  "name": "<name>",
  "rollNo": "<roll-number>",
  "accessCode": "<access-code>",
  "clientID": "<client-id>",
  "clientSecret": "<client-secret>"
}
```

**Response:**
```json
{
  "token_type": "Bearer",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkaHJ1djExODcuYmUyM0BjaGl0a2FyYXVuaXZlcnNpdHkuZWR1LmluIiwiZXhwIjoxNzc3OTYwOTg2LCJpYXQiOjE3Nzc5NjAwODYsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIxNGY4NDRlNS1iMzJkLTQwY2MtODU2OC1lMjYwNzdlNGIwZjUiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJkaHJ1diBkYWxhbCIsInN1YiI6IjA0MTQyMTIyLTNkZmYtNDhmYS04NjFkLWM4NDYzYWVlZTE1ZSJ9LCJlbWFpbCI6ImRocnV2MTE4Ny5iZTIzQGNoaXRrYXJhdW5pdmVyc2l0eS5lZHUuaW4iLCJuYW1lIjoiZGhydXYgZGFsYWwiLCJyb2xsTm8iOiIyMzExOTgxMTg3IiwiYWNjZXNzQ29kZSI6IkVYZnZEcCIsImNsaWVudElEIjoiMDQxNDIxMjItM2RmZi00OGZhLTg2MWQtYzg0NjNhZWVlMTVlIiwiY2xpZW50U2VjcmV0IjoiaEtHYVFYTXVwdHVOWnd1aCJ9.l2NccsEBS6HndQFlfhpW4lk-8_C00fA1oCJbXDPttXk",
  "expires_in": 1777960986
}
```

> This Bearer token is used in the `Authorization` header for all protected routes like the Log API. The token needs to be refreshed by calling the auth endpoint again when it expires.

---

## Logging Middleware

### What it does

This is a reusable package/module that both the backend and frontend use. Every time something meaningful happens in the app — a request comes in, a DB query runs, an error occurs — this function gets called and sends a log entry to the test server.

**Function signature:**
```
Log(stack, level, package, message)
```

### Log API

**Endpoint:** `POST http://20.207.122.201/evaluation-service/logs`

> This is a protected route — the Bearer token must be sent in the `Authorization` header.

**Request Body:**
```json
{
  "stack": "backend",
  "level": "error",
  "package": "handler",
  "message": "received string, expected bool"
}
```

**Response (200):**
```json
{
  "logID": "<uuid>",
  "message": "log created successfully"
}
```

### Allowed Values

**stack** (lowercase only):
- `"backend"`
- `"frontend"`

**level** (lowercase only):
- `"debug"`
- `"info"`
- `"warn"`
- `"error"`
- `"fatal"`

**package** — Backend only:
- `"cache"`, `"controller"`, `"cron_job"`, `"db"`, `"domain"`, `"handler"`, `"repository"`, `"route"`, `"service"`

**package** — Frontend only:
- `"api"`, `"component"`, `"hook"`, `"page"`, `"state"`, `"style"`

**package** — Both Backend and Frontend:
- `"auth"`, `"config"`, `"middleware"`, `"utils"`

---

## Progress Tracker

| Task                                   | Status     |
|----------------------------------------|------------|
| Project structure setup                | ✅ Done    |
| Registration with test server          | ✅ Done    |
| Auth token generation                  | ✅ Done    |
| Stage 1 — REST API Design              | ✅ Done    |
| Stage 2 — Database Design              | ✅ Done    |
| Stage 3 — Query Analysis               | ✅ Done    |
| Stage 4 — Performance Strategy         | ✅ Done    |
| Stage 5 — notify_all Redesign          | ✅ Done    |
| Stage 6 — Priority Inbox (Code)        | ✅ Done    |
| Stage 7 — React Frontend               | ✅ Done    |
| Logging middleware package             | ✅ Done    |
| Backend app (notification_app_be)      | ✅ Done    |

---

## Stage 1

### Overview

As a backend developer on a campus notification platform, the goal is to design a clean REST API that a frontend developer can consume. The platform delivers real-time updates to students about Placements, Events, and Results.

### Core Actions the Platform Needs to Support

1. Fetch all notifications for a student (paginated, filterable by type)
2. Fetch a single notification by its ID
3. Mark a specific notification as read
4. Mark all notifications as read at once
5. Get the count of unread notifications
6. Get priority-ranked notifications (top n)
7. Subscribe to real-time notification updates

### REST API Endpoints

#### 1. Get All Notifications

```
GET /api/v1/notifications
```

**Headers:**
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |
| `notification_type` | string | Filter by `"Event"`, `"Result"`, or `"Placement"` |
| `is_read` | boolean | Filter by read/unread status |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "d146095a-0d86-4a34-9e69-3900a14576bc",
        "type": "Placement",
        "message": "CSX Corporation is hiring",
        "is_read": false,
        "created_at": "2026-04-22T17:51:18Z"
      }
    ],
    "pagination": {
      "total": 120,
      "page": 1,
      "limit": 20,
      "total_pages": 6
    }
  }
}
```

---

#### 2. Get a Single Notification

```
GET /api/v1/notifications/:id
```

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "d146095a-0d86-4a34-9e69-3900a14576bc",
    "type": "Placement",
    "message": "CSX Corporation is hiring",
    "is_read": false,
    "created_at": "2026-04-22T17:51:18Z"
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "error": "Notification not found"
}
```

---

#### 3. Mark a Notification as Read

```
PATCH /api/v1/notifications/:id/read
```

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

#### 4. Mark all notifications as Read

```
PATCH /api/v1/notifications/read-all
```

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "updated_count": 45
}
```

---

#### 5. Get Unread Count

```
GET /api/v1/notifications/unread-count
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "unread_count": 12
  }
}
```

---

#### 6. Get Priority Notifications (Top N)

```
GET /api/v1/notifications/priority?limit=10
```

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `limit` | number | How many top notifications to return (default: 10) |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "b283218f-ea5a-4b7c-93a9-1f2f240d64b0",
        "type": "Placement",
        "message": "CSX Corporation hiring",
        "is_read": false,
        "created_at": "2026-04-22T17:51:18Z",
        "priority_score": 98
      }
    ]
  }
}
```

---

#### 7. Real-Time Notification Stream (SSE)

```
GET /api/v1/notifications/stream
```

**Headers:**
```json
{
  "Authorization": "Bearer <token>",
  "Accept": "text/event-stream"
}
```

**Stream Events:**
```
event: notification
data: {"id": "abc123", "type": "Placement", "message": "TCS is hiring", "created_at": "2026-05-05T10:00:00Z"}

event: ping
data: {"timestamp": "2026-05-05T10:00:30Z"}
```

### Real-Time Mechanism: Server-Sent Events (SSE)

SSE was chosen over WebSockets because notifications are **one-directional** (server pushes to client only). SSE is built on standard HTTP, automatically reconnects if the connection drops, and is natively supported in all modern browsers without any extra libraries.

### Common Error Response Format

```json
{
  "success": false,
  "error": "<human readable message>",
  "code": "<error_code_string>"
}
```

| HTTP Status | When it happens |
|---|---|
| 200 | Request succeeded |
| 400 | Bad request / invalid params |
| 401 | Missing or invalid token |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Stage 2

### Database Choice: PostgreSQL

PostgreSQL was chosen because:
- Notifications and students have a clear **relational structure** — many students receive many notifications, which maps naturally to a relational model with a junction table
- Strong **ACID guarantees** — critical when 50,000 students need to reliably receive notifications without data loss
- Excellent support for **UUID primary keys**, **enums**, **partial indexes**, and **date range queries** — all needed in this project
- Handles both high-read and bulk-write workloads well when properly indexed
- Mature TypeScript ecosystem via libraries like `pg` or `Prisma`

---

### Database Schema

```sql
CREATE TABLE students (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(100)        NOT NULL,
    email        VARCHAR(255) UNIQUE  NOT NULL,
    roll_number  VARCHAR(50) UNIQUE   NOT NULL,
    created_at   TIMESTAMP           DEFAULT NOW()
);

CREATE TYPE notification_type AS ENUM ('Event', 'Result', 'Placement');

CREATE TABLE notifications (
    id           UUID PRIMARY KEY    DEFAULT gen_random_uuid(),
    type         notification_type   NOT NULL,
    message      TEXT                NOT NULL,
    created_at   TIMESTAMP           DEFAULT NOW()
);

CREATE TABLE student_notifications (
    id                SERIAL PRIMARY KEY,
    student_id        INT  REFERENCES students(id)       ON DELETE CASCADE,
    notification_id   UUID REFERENCES notifications(id)  ON DELETE CASCADE,
    is_read           BOOLEAN   DEFAULT FALSE,
    read_at           TIMESTAMP,
    created_at        TIMESTAMP DEFAULT NOW(),
    UNIQUE (student_id, notification_id)
);

CREATE INDEX idx_sn_student_unread
    ON student_notifications (student_id, is_read, created_at DESC)
    WHERE is_read = FALSE;

CREATE INDEX idx_notif_type_created
    ON notifications (type, created_at DESC);
```

---

### SQL Queries for the Stage 1 APIs

**GET /api/v1/notifications — fetch paginated notifications for a student**
```sql
SELECT
    n.id,
    n.type,
    n.message,
    n.created_at,
    sn.is_read
FROM notifications n
JOIN student_notifications sn ON n.id = sn.notification_id
WHERE sn.student_id = $1
ORDER BY n.created_at DESC
LIMIT $2 OFFSET $3;
```

**PATCH /api/v1/notifications/:id/read — mark one as read**
```sql
UPDATE student_notifications
SET is_read = TRUE, read_at = NOW()
WHERE student_id = $1 AND notification_id = $2;
```

**PATCH /api/v1/notifications/read-all — mark all as read**
```sql
UPDATE student_notifications
SET is_read = TRUE, read_at = NOW()
WHERE student_id = $1 AND is_read = FALSE;
```

**GET /api/v1/notifications/unread-count**
```sql
SELECT COUNT(*) AS unread_count
FROM student_notifications
WHERE student_id = $1 AND is_read = FALSE;
```

**GET /api/v1/notifications/priority?limit=10**
```sql
SELECT
    n.id,
    n.type,
    n.message,
    n.created_at,
    sn.is_read
FROM notifications n
JOIN student_notifications sn ON n.id = sn.notification_id
WHERE sn.student_id = $1 AND sn.is_read = FALSE
ORDER BY
    CASE n.type
        WHEN 'Placement' THEN 1
        WHEN 'Result'    THEN 2
        WHEN 'Event'     THEN 3
    END ASC,
    n.created_at DESC
LIMIT $2;
```

---

### Scale Problems and Solutions

With 50,000 students and 5,000,000 notifications, the `student_notifications` table can grow to hundreds of millions of rows. Here are the problems and solutions:

| Problem | Solution |
|---|---|
| Full table scans on large tables | Composite partial indexes on `(student_id, is_read, created_at)` |
| Slow bulk inserts during notify_all | Batch inserts — `INSERT INTO ... VALUES (...), (...), ...` in one query |
| DB connection pool exhaustion | Use PgBouncer (connection pooler) in front of PostgreSQL |
| Growing table size over time | Partition `student_notifications` by `created_at` (monthly ranges) |
| Read-heavy load on single DB instance | Add a PostgreSQL read replica for all SELECT queries |
| Repeated identical queries per student | Redis caching layer with per-student TTL and invalidation on new notifications |
---

## Stage 3

### The Slow Query

```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

### Is This Query Accurate?

Not quite. Based on the schema designed in Stage 2, the isRead column does not live in the 
otifications table, it lives in student_notifications. So this query would either fail or return wrong data depending on the actual schema.

### Why Is It Slow?

With 5,000,000 notification rows:

1. **SELECT *** fetches every column including large TEXT fields, unnecessary data transfer even if the UI only needs ID and message
2. **No index** on (studentID, isRead) means the DB does a full sequential scan through millions of rows to find matches
3. **ORDER BY createdAt ASC** requires sorting the full result set, an additional O(k log k) pass on top of the scan

**Computation cost:** O(n) for the scan + O(k log k) for sorting, where n = 5M and k = matched rows. At this scale this can take multiple seconds.

### What Would I Change?

**Fixed query (corrected for the actual schema):**
```sql
SELECT
    n.id,
    n.type,
    n.message,
    n.created_at
FROM notifications n
JOIN student_notifications sn ON n.id = sn.notification_id
WHERE sn.student_id = 1042
  AND sn.is_read = FALSE
ORDER BY n.created_at ASC;
```

**Index to add:**
```sql
CREATE INDEX idx_sn_student_unread_created
    ON student_notifications (student_id, is_read, created_at ASC)
    WHERE is_read = FALSE;
```

This is a **partial index**, it only indexes rows where is_read = FALSE, keeping the index small and fast. The DB can seek directly to student_id = 1042 without touching read notifications.

### Should We Add Indexes on Every Column?

**No. This is bad advice.** Here is why:

- Every index is a separate data structure the DB must maintain
- Every INSERT, UPDATE, and DELETE must update all indexes on that table
- With 50k students receiving bulk notifications, the write performance would collapse
- Indexes consume significant disk space
- The DB query planner may even ignore some indexes if it decides a sequential scan is cheaper

The right approach is to index only the columns used in WHERE, JOIN ON, and ORDER BY clauses, and prefer composite indexes over many single-column ones.

### Query: Students Who Got a Placement Notification in the Last 7 Days

```sql
SELECT DISTINCT
    s.id,
    s.name,
    s.email,
    s.roll_number
FROM students s
JOIN student_notifications sn ON s.id = sn.student_id
JOIN notifications n ON sn.notification_id = n.id
WHERE n.type = 'Placement'
  AND n.created_at >= NOW() - INTERVAL '7 days';
```

---

## Stage 4

### The Problem

Notifications are being fetched from the database on every single page load for every student. With 50,000 students potentially refreshing their dashboards, this creates a massive read load, causing slow responses and bad user experience.

### Strategies and Tradeoffs

#### Strategy 1: Redis Caching

Cache each student's notification list in Redis with a TTL (e.g., 60 seconds). On a page load, check Redis first. If data is there (cache hit), return it instantly. If not (cache miss), query the DB and store the result in Redis.

| Tradeoff | Detail |
|---|---|
| ? Massive reduction in DB reads | Most page loads become Redis lookups |
| ? Sub-millisecond response times | Redis is in-memory |
| ?? Stale data | User may see up to 60s old notifications |
| ?? Cache invalidation complexity | Must invalidate the right keys when new notifications arrive |
| ?? Added infrastructure | Redis cluster needs to be maintained |

#### Strategy 2: Pagination

Instead of loading all notifications at once, load 20 at a time. Users load more only when they scroll.

| Tradeoff | Detail |
|---|---|
| ? Each query is small and fast | DB only scans one small slice |
| ? Works with proper indexes | No full table scans |
| ?? Multiple API calls needed | Scroll-to-load requires extra requests |
| ?? Does not eliminate repeated loads | Same data still fetched on every refresh |

#### Strategy 3: Real-Time Push with SSE

Instead of the client asking for new notifications on every page load, the server pushes new notifications as they arrive via SSE. The client fetches the initial list once and receives updates passively.

| Tradeoff | Detail |
|---|---|
| ? Eliminates repeated fetches | Initial load + stream = no polling |
| ? Instant delivery | No delay waiting for next poll |
| ?? Persistent connections | Each online student holds an open HTTP connection |
| ?? Server memory per connection | 50k concurrent SSE connections = significant memory |

#### Strategy 4: Database Read Replicas

Direct all SELECT queries to a PostgreSQL read replica. All write queries go to the primary. This distributes the load.

| Tradeoff | Detail |
|---|---|
| ? Primary DB protected from read load | Writes still go to primary |
| ? Scales horizontally | Add more replicas as needed |
| ?? Replication lag | Replica may be slightly behind primary |
| ?? More infrastructure cost | Additional DB server(s) |

#### Strategy 5: Cache Only the Unread Count

Cache just the unread count number per student. It is tiny (one integer), quick to update, and eliminates the most common DB call, the badge count shown on every page.

| Tradeoff | Detail |
|---|---|
| ? Extremely cheap to cache and invalidate | Just one number per student |
| ? Eliminates the most frequent query | Badge count is shown everywhere |
| ?? Only solves the count problem | Full notification list still needs other strategies |

### Recommended Combination

The best approach is layered:
1. **Pagination** as the baseline (small queries always)
2. **Redis cache** for notification lists with cache invalidation on new notifications
3. **SSE** for real-time push so the frontend does not need to re-fetch at all
4. **Unread count cache** for the badge indicator

---

## Stage 5

### The Original Implementation

```
function notify_all(student_ids: array, message: string):
    for student_id in student_ids:
        send_email(student_id, message)    # calls Email API
        save_to_db(student_id, message)    # DB insert
        push_to_app(student_id, message)   # real-time push via SSE
```

### What is Wrong With This?

1. **Sequential processing**, 50,000 students are processed one by one. If each iteration takes 50ms, the full loop takes ~42 minutes
2. **No error handling**, if send_email fails midway, there is no way to know which students were missed and no retry happens
3. **No atomicity**, email might go out but DB insert fails, leaving inconsistent state
4. **Server blocking**, the entire server thread is occupied for the duration of the loop
5. **External API in a tight loop**, any slowdown in the Email API cascades across all 50k iterations

### What Happens When send_email Fails for 200 Students Midway?

With the original code, those 200 students are silently dropped. The loop either crashes and stops processing the remaining students, or skips those 200 with no record of the failure. There is no way to retry just the failed ones.

### Should Saving to DB and Sending Email Happen Together?

No. They should be **decoupled**:

- The DB insert is the **source of truth**, it should happen first, independently, regardless of whether the email succeeds
- Email is a **side effect** that depends on an external service and can fail for reasons outside our control
- If both are wrapped in one transaction and email fails, rolling back the DB insert means the notification is also lost, which is worse than just a failed email
- DB inserts are fast and local; email delivery is slow and remote

### Revised Pseudocode

```
function notify_all(student_ids: array, message: string):

    # Step 1: Save all to DB first in one bulk insert; fast, atomic, recoverable
    batch_save_to_db(student_ids, message)

    # Step 2: Push individual delivery jobs to a message queue (e.g., BullMQ / Redis Queue)
    for student_id in student_ids:
        queue.push({
            job_type:    "deliver_notification",
            student_id:  student_id,
            message:     message,
            retry_count: 0,
            created_at:  now()
        })

    # notify_all returns immediately; actual delivery is async


function worker():  # multiple workers run in parallel
    while true:
        job = queue.pop()
        if job is null:
            wait(100ms)
            continue

        try:
            send_email(job.student_id, job.message)
            push_to_app(job.student_id, job.message)

        catch error:
            if job.retry_count < MAX_RETRIES:   # e.g., MAX_RETRIES = 3
                job.retry_count += 1
                delay = exponential_backoff(job.retry_count)  # 1s, 2s, 4s
                queue.push_with_delay(job, delay)
            else:
                dead_letter_queue.push(job)   # flagged for manual review
```

### Why This Is Better

| Problem in Original | Fix in Revised |
|---|---|
| Sequential 50k loop | Multiple workers process jobs in parallel |
| No error handling | Try/catch with retry logic per job |
| No atomicity | DB insert happens first in bulk, independently |
| Server blocking | notify_all returns instantly; delivery is async |
| Lost failed jobs | Dead letter queue captures permanently failed jobs |
| No audit trail | Every job and retry is logged via the logging middleware |

---

## Stage 6

### Approach

The Priority Inbox fetches all notifications from the test server API and scores each one using a two-factor formula:

**Priority Score = Type Weight + Recency Score**

- **Type Weight**: Placement = 300, Result = 200, Event = 100
- **Recency Score**: 0 to 100, calculated by normalising the notification timestamp against the oldest and newest timestamps in the current fetched set

This ensures Placement notifications always outrank Result and Event ones, but within the same type, newer notifications rank higher. As new notifications come in, the scoring adjusts automatically since the min/max timestamps are always recalculated.

### Code Location

`notification_app_be/priority_inbox.ts`

### How to Run

```
cd notification_app_be
npm run priority-inbox
```

### Sample Output (Top 10)

```
========== TOP 10 PRIORITY NOTIFICATIONS ==========

1. [Placement] Berkshire Hathaway Inc. hiring
   Timestamp : 2026-05-05 03:21:45
   Score     : 300 (type) + 100 (recency) = 400
   ID        : 89a7e688-bfeb-499a-bfe8-7cb1ea74f550

2. [Placement] Berkshire Hathaway Inc. hiring
   Timestamp : 2026-05-05 02:20:37
   Score     : 300 (type) + 95 (recency) = 395

3. [Placement] Visa Inc. hiring
   Score     : 300 (type) + 63 (recency) = 363

7. [Result] mid-sem
   Score     : 200 (type) + 82 (recency) = 282

10. [Result] external
   Score     : 200 (type) + 47 (recency) = 247
```

---

## Stage 7

### Architecture

```
Browser (localhost:3000)
    └── calls our Express backend (localhost:5000)
            └── calls test server (20.207.122.201)
```

The frontend never talks to the test server directly. The Express backend proxies all calls, handles auth token management, tracks read/unread state in memory, and returns clean paginated responses.

### Pages

**All Notifications (`/`)**
- 50 total notifications fetched across pages (test server max is 10 per request, so backend fetches in batches)
- Paginated — 20 per page, 10 pages total
- Filter by notification type (Placement / Result / Event)
- Click the tick icon on any unread card to mark it as read
- Mark All Read button
- Unread badge in the navbar updates live

**Priority Inbox (`/priority`)**
- Top n notifications ranked by type weight + recency score
- User can choose n = 10, 15, or 20 from a dropdown
- Filter by type within the ranked list
- Each notification shows its rank number (#1, #2, etc.)

### Read/Unread Visual Distinction

| State | Visual |
|---|---|
| Unread | Coloured left border (green/blue/orange by type), "NEW" badge, bold text, white background |
| Read | No border, no badge, normal weight, grey/subdued background |

### Styling

Material UI was used throughout. No ShadCN, no Tailwind, no other CSS libraries.

### How to Run

```
# Terminal 1
cd notification_app_be
npm run dev

# Terminal 2
cd notification_app_fe
npm run dev

# Open http://localhost:3000
```
