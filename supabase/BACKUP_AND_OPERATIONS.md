# Fusionsole Admin Panel - Supabase Database Backup & Operations Guide
**Target Platform: Supabase PostgreSQL (Free Tier)**

---

## 1. Important Free Tier Operating Characteristics

> [!WARNING]
> **Free Tier Backup Limitation:**
> Supabase Free Tier projects **do not** include automated point-in-time recovery (PITR) or daily automated database backups.
> Database backups must be performed periodically using manual exports or automated GitHub Actions/CLI backups.
> Projects on the Free Tier may pause after 7 days of inactivity. Any HTTP query or dashboard login instantly unpauses the database.

---

## 2. Recommended Manual Database Backup Procedures

### Method A: Supabase Dashboard UI Export (Quickest)
1. Navigate to your project on [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Go to **Settings** -> **Database**.
3. Scroll down to **Backups**.
4. Click **Download Backup** (or go to **Table Editor** -> select table -> click **Export as CSV** for tabular audits).

### Method B: PostgreSQL pg_dump CLI (Complete Schema & Data)
Use standard `pg_dump` with your project's connection string (found in Supabase Settings -> Database -> Connection string -> URI):

```bash
# 1. Full database dump (Schema + Data)
pg_dump "postgres://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres" \
  -F c -b -v -f fusionsole_backup_$(date +%Y%m%d).dump

# 2. Schema-only export
pg_dump "postgres://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres" \
  --schema-only -f fusionsole_schema_$(date +%Y%m%d).sql

# 3. Data-only export for content tables
pg_dump "postgres://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres" \
  --data-only \
  -t public.categories \
  -t public.subjects \
  -t public.modules \
  -t public.quizzes \
  -t public.quiz_questions \
  -t public.quiz_options \
  -f fusionsole_learning_content_$(date +%Y%m%d).sql
```

---

## 3. Disaster Recovery & Restoration Procedure

To restore a fresh or existing database from backup:

```bash
# Restore custom-format dump into target database
pg_restore -v -d "postgres://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres" \
  --clean --if-exists fusionsole_backup_YYYYMMDD.dump
```

Or replay migrations in sequence:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_seed_data.sql`
3. `supabase/migrations/003_storage_and_helpers.sql`

---

## 4. Free Tier Storage & Bandwidth Optimization

1. **Video Hosting on YouTube:**
   - Raw video files must NEVER be uploaded directly to Supabase Storage (500MB storage limit on Free tier).
   - All training videos are hosted on YouTube (Unlisted or Public) and embedded via lightweight validated IDs.
2. **Image Assets:**
   - Compress all module and department cover photos to WebP or optimized JPEG under 250KB before uploading.
   - The `learning-assets` bucket is configured with a strict 5MB upload limit per object.
3. **Database Size Footprint:**
   - Schema uses normalized foreign keys and lightweight JSONB for ordered lists (`learning_objectives`, `instructions`).
   - The entire 28-module curriculum occupies under 2MB of database disk space.

---

## 5. Security & Key Management Checklist

- [x] **Service Role Key:** Kept strictly server-side / in protected environments. Never committed to git.
- [x] **Row Level Security (RLS):** Enabled and enforced on all 7 tables.
- [x] **Quiz Key Masking:** Correct answers are hidden behind the `evaluate_quiz_submission()` database function.
- [x] **Admin Verification:** Enforced via `public.is_admin()` checking active profile role.
