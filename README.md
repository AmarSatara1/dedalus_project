# Technical Interview — Medical Report Editor

## Overview

This is a partially scaffolded medical report editor. The UI structure, database schema, and some utility code are already in place. Your job is to **wire everything together** and implement the missing functionality described in the tasks below.

Take time to explore the codebase before you start coding — understanding the existing structure will save you time.

---

## Tech Stack

| Layer            | Technology                                                     |
| ---------------- | -------------------------------------------------------------- |
| Framework        | **Next.js 16** (App Router, Server Components, Server Actions) |
| Language         | **TypeScript**                                                 |
| Database         | **PostgreSQL 16** (via Docker)                                 |
| ORM              | **Prisma 7** (schema, migrations, and seed already configured) |
| Rich-text editor | **TipTap** (based on ProseMirror — content stored as JSON)     |
| Styling          | **Tailwind CSS 4**                                             |

You are free to install additional libraries if needed, but the ones above should be sufficient.

---

## Setup & Running Locally

### Prerequisites

- **Node.js** ≥ 20
- **Docker** (for PostgreSQL)
- **npm**

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start the PostgreSQL database
docker compose up -d

# 3. Push the Prisma schema to the database
npx prisma db push

# 4. Seed the database with sample reports
npx prisma db seed

# 5. Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**.

> The database runs on port **5433** (not the default 5432). The connection string is already configured in `.env`.

---

## Tasks

Complete the following tasks. They are listed roughly in order of complexity.

### 1. Worklist page

Fetch all reports from the database and display them on the worklist page (`src/app/reports/page.tsx`). Each entry should display the report's id, patient name, patient age, creation date, update date, and verification status. Clicking a report should navigate to its editor page.

### 2. Report page — Load report into editor

Fetch the report by its `id` and initialise the TipTap editor with the report's JSON content. Display the patient name as the page title.

### 3. Sidebar — Patient info

Populate the "Patient Info" sidebar tab with the current report's patient name and age.

### 4. Autosave

Implement an autosave mechanism so that editor changes are automatically persisted to the database. You can choose whatever timing strategy you prefer (debounce, throttle, on-idle, etc.) but it **must trigger automatically** — no manual "Save" button. The UI should reflect whether the content is currently synced.

### 5. Report verification

Add the ability to verify a report. Once verified, the report **cannot be edited** — the editor must become read-only and the verify action should no longer be available.

### 6. Corrections

This task involves multiple parts:

1. Add a way for the user to request corrections for the current report. There is a corrections API already implemented at `POST /api/ai/corrections` — read the route handler to understand the expected input and output format.
2. Display the returned corrections in the sidebar's "Corrections" tab.
3. When a correction is applied, append its text as a new paragraph at the end of the report content.
4. Once a correction is applied, remove it from the list.

You'll need to find a way to share the TipTap editor state across components. Feel free to restructure the existing code as needed.

---

## Evaluation Criteria

- Correctness of the implemented features
- Code quality and organisation
- Appropriate use of Next.js patterns (Server Components vs Client Components, data fetching)
- TypeScript usage
- Error handling where appropriate

Good luck!
