# Environment Configuration

The application requires specific environment variables to handle database connections, session management, and authentication scopes.

---

## 1. Local Variables File (.env)
Duplicate `.env.example` to create your local variables configuration file:
```bash
cp .env.example .env.local
```

---

## 2. Key References

### Supabase Settings:
* `NEXT_PUBLIC_SUPABASE_URL`: API URL found inside Supabase settings under **Project Settings** -> **API**.
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Client-side key for database access controls.
* `SUPABASE_SERVICE_ROLE_KEY`: Service-level token used only in secure backend handlers.

### Database Connection:
* `DATABASE_URL`: Connection string connecting to PostgreSQL with PGBouncer pooling enabled.

### Authentication Settings:
* `NEXTAUTH_SECRET`: Secret key used to encrypt cookie credentials. Can be generated locally using:
  ```bash
  openssl rand -base64 32
  ```
* `NEXTAUTH_URL`: Local dev url (`http://localhost:3000`) or deployment url (`https://yoursite.vercel.app`).
