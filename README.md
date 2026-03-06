# ABC Tester

A social media-themed calculator application built with Next.js, TypeScript, and SQLite.

## Features

- ✅ Fully functional calculator (arithmetic, %, +/- operations)
- ✅ Keyboard input support
- ✅ Calculation history stored in SQLite via TypeORM
- ✅ Social media-inspired UI with gradient backgrounds
- ✅ Share results via Twitter/X, Facebook, and Copy Link
- ✅ Responsive design (desktop + mobile)
- ✅ Docker support for easy deployment

## Getting Started

### Local Development

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Docker Compose

```bash
docker-compose up --build
```

## Environment Variables

See `.env` file:

```
DATABASE_PATH=./data/abc-tester.db
NEXT_PUBLIC_APP_NAME=ABC Tester
NODE_ENV=development
```

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **TypeORM** + **better-sqlite3**
- **Docker** (multi-stage build)
