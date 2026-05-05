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
  "email": "...",
  "name": "...",
  "rollNo": "...",
  "accessCode": "...",
  "clientID": "<saved-client-id>",
  "clientSecret": "<saved-client-secret>"
}
```

> The `clientID` and `clientSecret` from the response were saved securely. They cannot be retrieved again.

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
  "access_token": "<jwt-token>",
  "expires_in": <timestamp>
}
```

> This Bearer token is used in the `Authorization` header for all protected routes like the Log API.

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

| Task                            | Status      |
|---------------------------------|-------------|
| Project structure setup         | ✅ Done     |
| Registration with test server   | ⬜ Pending  |
| Auth token generation           | ⬜ Pending  |
| Logging middleware               | ⬜ Pending  |
| Backend app (notification_app_be) | ⬜ Pending |
| Frontend app (notification_app_fe) | ⬜ Pending |
