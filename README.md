# StratonBot

StratonBot is a complete bot management and financial platform.

## Prerequisites

- Node.js (v16+)
- PostgreSQL

## Setup

### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Rename `.env.example` to `.env` (if applicable) or check the created `.env` file.
   - Update `DATABASE_URL` with your PostgreSQL credentials.
4. Run database migrations and seed:
   ```bash
   npx prisma generate
   npx prisma db push
   npx ts-node prisma/seed.ts
   ```
5. Start the server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:3001`.

### Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

## Usage

1. Open the frontend URL.
2. Login with the admin credentials (seeded):
   - Email: `stranpay@gmail.com`
   - Password: `M100710$s`
3. Or register a new user account to test the player flow.

## Features

- **Bot Management**: Create and manage bots with API keys.
- **Finance**: View balance, transactions, manage Pix keys, and request withdrawals.
- **Admin Panel**: Approve withdrawals, view system stats.
- **Inter Integration**: Webhook endpoint ready at `/api/webhooks/inter`.
