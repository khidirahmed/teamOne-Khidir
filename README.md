# teamOne

Bobcat Go is a static frontend plus a Godot web export. The app uses Supabase for
email/password auth and to save completed runs.

## Supabase Setup

1. Create a new Supabase project.
2. In the Supabase dashboard, go to `Authentication` -> `Providers` -> `Email`.
3. Make sure email/password auth is enabled.
4. Turn off email confirmation for development so sign-up works immediately.
5. Open the SQL editor and run `supabase/bootstrap.sql`.
6. Copy `frontend/js/supabase-config.example.js` to `frontend/js/supabase-config.js`.
7. Paste your project URL and publishable anon key into `frontend/js/supabase-config.js`.
8. Do not use the Supabase service-role key in the frontend.

## Local Run

1. Start a static server from the repo root:

```bash
python3 -m http.server 8000
```

2. Open `http://localhost:8000/frontend/`.
3. Sign up with a new account and start a run.
4. After a game over, check the `runs` table in Supabase to confirm the row was saved.

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
- If auth buttons show a setup alert, `frontend/js/supabase-config.js` is missing or empty.
- If run saving fails, make sure you ran `supabase/bootstrap.sql` in your own project and signed in before starting the game.
