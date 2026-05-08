# Canonical data model + security (baseline)

**Purpose:** Single place to edit table/RLS text duplicated inside each `fsp-*.md`. When you change this file, update the embedded blocks in those files (or regenerate them).

Use **Supabase** (or equivalent) with **RLS**. Store event times in **`timestamptz`** (UTC); store **`timezone`** as an **IANA** string for display and calendar exports.

## Tables (minimum columns)

- `profiles`: `id` (PK = auth user id), `full_name`, `avatar_url`, timestamps.
- `hosts`: `id`, `owner_user_id`, `slug` (unique), `name`, `logo_url`, `bio`, `contact_email`, timestamps.
- `host_members`: `id`, `host_id`, `user_id`, `role` (`host`|`checker`), unique `(host_id,user_id)`.
- `host_invites`: `id`, `host_id`, `role`, `token` (unique), `expires_at`, optional `max_uses`, `uses_count`.
- `events`: `id`, `host_id`, `slug` (**unique per host OR globally unique — pick one and enforce**), `title`, `description`, `cover_image_url`, `start_at`, `end_at`, `timezone`, `venue_text` **nullable**, `online_url` **nullable**, **business rule**: published events should have at least one of venue/online (enforce in editor/RPC), `capacity` int **> 0**, `visibility` (`public`|`unlisted`), `status` (`draft`|`published`), `pricing` defaults to `free`.
- `event_rsvps`: `id`, `event_id`, `user_id`, `status` (`confirmed`|`waitlisted`|`cancelled`), timestamps; enforce **one active RSVP per user/event** (unique partial index where status in (`confirmed`,`waitlisted`) OR equivalent constraint strategy).
- `waitlist_entries`: `id`, `event_id`, `user_id`, `queued_at` (**FIFO**), unique `(event_id,user_id)` for active rows.
- `tickets`: `id`, `event_id`, `user_id`, `ticket_code` (**globally unique recommended**), timestamps, `revoked_at` nullable.
- `check_ins`: `id`, `event_id`, `ticket_id` **unique**, `checked_in_at`, optional `checked_in_by_user_id`.
- `gallery_items`: `id`, `event_id`, `created_by`, `image_url`, `status` (`pending`|`approved`|`rejected`|`hidden`).
- `event_feedback`: `id`, `event_id`, `user_id`, `stars` int 1–5, `comment` nullable, `created_at`, unique `(event_id,user_id)`.
- `reports`: `id`, `target_type` (`event`|`gallery_item`), `target_id` (uuid), `host_id` (**denormalized** for queue scoping), `reporter_user_id`, `status` (`open`|`hidden`|`dismissed`), `created_at`.
- `user_notifications`: `id`, `user_id`, `type`, `payload` json/text, `read_at` nullable, `created_at`.

## RLS intent (baseline)

- Authenticated users can manage **their profile** where applicable.
- Host **`host` role** can CRUD **their host’s events** (draft visibility restricted to members).
- Public read policies must not leak **draft** events to non‑members.
- **`checker`** role must not gain host‑only privileges (narrow checker policies in FSP‑4; tighten route guards + RLS there).
