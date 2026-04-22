# teamOne

Bobcat Go is a static frontend plus a Godot web export. The app uses Supabase for
email/password auth and to save completed runs.

## Shared Supabase Setup

This repo is already configured to use the shared Bobcat Go Supabase project, so
anyone who clones it can sign up and save runs without creating a local config file.
The committed frontend key is the publishable anon key only. Never replace it with
the Supabase service-role key.

For this shared setup to work, the Supabase project must keep these settings:

1. Email/password auth enabled.
2. Signups allowed.
3. Email confirmation turned off for instant development signups.
4. `supabase/bootstrap.sql` already applied to the project.

## Running The Repo

1. Start a static server from the repo root:

```bash
python3 -m http.server 8000
```

2. Open `http://localhost:8000/frontend/`.
3. Sign up with a new account or sign in with an existing one.
4. Start a run and finish a game.
5. Check the shared Supabase project to confirm the run was saved in `public.runs`.

## Using Your Own Supabase Project

1. Create a new Supabase project.
2. In the Supabase dashboard, go to `Authentication` -> `Providers` -> `Email`.
3. Make sure email/password auth is enabled.
4. Turn off email confirmation for development so sign-up works immediately.
5. Open the SQL editor and run `supabase/bootstrap.sql`.
6. Copy `frontend/js/supabase-config.example.js` to `frontend/js/supabase-config.js`.
7. Paste your project URL and publishable anon key into `frontend/js/supabase-config.js`.
8. Do not use the Supabase service-role key in the frontend.

## What Gets Saved

The app currently stores one row per completed run in `public.runs`:

- `user_id`
- `map_id`
- `started_at`
- `ended_at`
- `score`
- `created_at`

The leaderboard screen is still static for now, so this setup focuses on auth and
run saving.

## Troubleshooting

- If sign-up succeeds but no user ID is returned, email confirmation is still enabled.
- If auth buttons show a setup alert, `frontend/js/supabase-config.js` is missing, empty, or no longer contains a valid shared project config.
- If run saving fails, make sure you ran `supabase/bootstrap.sql` in your own project and signed in before starting the game.
