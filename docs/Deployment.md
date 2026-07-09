# Deployment Guide

This guide provides step-by-step instructions for hosting the **FitBharat** application with its Next.js frontend, backend API routes, Prisma ORM, and Supabase Database.

---

## 1. Database Setup (Supabase)

Before deploying the frontend, you must set up your PostgreSQL database on Supabase:

1. **Create a Supabase Project**: Go to [Supabase](https://supabase.com) and create a new project.
2. **Retrieve Connection Strings**: Go to **Project Settings** -> **Database**:
   - Locate the **Connection string** (URI tab).
   - Copy the connection string for **Transaction Mode** (usually port `6543`) to use as `DATABASE_URL` (ensure `?pgbouncer=true` is appended).
   - Copy the connection string for **Session/Direct Mode** (usually port `5432`) to use as `DIRECT_URL`.
3. **Set local environment**: Create a `.env` file in the root of the project using [.env.example](file:///.env.example) as a reference, filling in your connection strings.
4. **Push Schema to Database**: Run the following command from the project root to create all tables, relations, and indexes in your Supabase database:
   ```bash
   npm run db:push
   ```

---

## 2. Vercel Deployment (Recommended)

Next.js projects deploy natively to Vercel with automatic asset optimizations and edge routing:

### Step-by-Step Vercel Setup:
1. **Push Code**: Push your repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. **Import Project**: Log into [Vercel](https://vercel.com/), click **Add New** -> **Project**, and import the repository.
3. **Configure Environment Variables**: Expand the **Environment Variables** panel and add the following variables:
   - `NEXTAUTH_URL`: Your production URL (e.g., `https://your-domain.vercel.app`)
   - `NEXTAUTH_SECRET`: A secure random 32-character string
   - `DATABASE_URL`: Your Supabase pooler connection string
   - `DIRECT_URL`: Your Supabase direct connection string
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase API endpoint
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon API key
4. **Configure Build Settings**: Vercel automatically detects Next.js. However, ensure that the build step runs Prisma client generation before building the app. Your build command in Vercel settings should be:
   ```bash
   prisma generate && next build
   ```
   *(Note: The build command is pre-configured to run generation if package scripts are set up, but specifying it explicitly guarantees generated types are available during Next.js compilation.)*
5. **Deploy**: Click **Deploy**. Vercel compiles the build, minifies chunks, runs Next.js image configurations, and provides a production-ready URL.

---

## 3. Docker Deployment (Self-Hosted)

For self-hosting on AWS, Google Cloud, digital ocean, or custom VPS containers:

### Build Image:
Ensure your environment variables are configured, then run:
```bash
docker build -t fitbharat:latest .
```

### Run Container:
```bash
docker run -p 3000:3000 --env-file .env fitbharat:latest
```
