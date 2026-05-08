# FULL STANDALONE PROMPT — paste **entire file** into Lovable as one message

This is prompt 2 of 5. **FSP‑2 — Explore + Event pages:** Explore + Event page UX + auth return URL + social previews

---

You are implementing on **this Lovable project**. **Assume no chat history.** Follow **only** this message.

### EMBEDDED SPEC — Goals / Features / Requirements (whole product)

**Goals:** Free community events platform: publish → RSVP/tickets → waitlist → check‑in → feedback → gallery moderation → reporting.

**Whole‑product features (do not forget global rules while implementing this slice)**

- Explore browse + filters (**default upcoming**, **Include past**, location filter, text search).
- **Unlisted** never appears in Explore lists (direct URL only).
- Event pages accessible anonymously for **published** events **including past**.
- Past events: **Ended** UI + **RSVP hidden**.
- RSVP requires auth + **return to same event URL** after sign‑in.
- OG/Twitter metadata on **Event** + **Host** pages.

### CANONICAL DATA MODEL + SECURITY

Create or reconcile the full baseline schema if missing (same contract as FSP‑1):

Use **Supabase** (or equivalent) with **RLS**. Store event times in **`timestamptz`** (UTC); store **`timezone`** as an **IANA** string for display and calendar exports.

**Tables (minimum columns)**

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

**RLS intent (baseline)**

- Authenticated users can manage **their profile** where applicable.
- Host **`host` role** can CRUD **their host’s events** (draft visibility restricted to members).
- Public read policies must not leak **draft** events to non‑members.
- **`checker`** role must not gain host‑only privileges (narrow checker policies in FSP‑4).

### INTEGRATION RULE

Merge without wiping prior work. Reconcile routing conflicts toward **`/explore`**, **`/e/[slug]`**, **`/h/[slug]`**.

### THIS FSP‑2 SCOPE — Implement completely

1. **`/explore`**
   - Lists **published + `visibility=public`** events only.
   - Text search across title/description (reasonable MVP).
   - Date range filter; **default upcoming**: `start_at >= now()` (UTC) unless **Include Past** expands results.
   - Location filter: substring match on `venue_text` (**document** if online‑only events are excluded).
   - **Include Past** toggle shows/hides ended events (`end_at < now()`).
   - Show **Ended** badges appropriately.

2. **Event detail `/e/[slug]`**
   - Accessible logged out for **published** events (including **unlisted** via URL).
   - **Draft** events viewable only by host/staff (`host` role for owning host); enforce server‑side.
   - Past: **Ended** + **hide RSVP UI**.
   - Upcoming: RSVP UI must route signed‑out users through auth with **safe same‑origin return URL**.

3. **SEO tags** on Host + Event public pages (`title`, `description`, `image`).

### ACCEPTANCE CHECKLIST — FSP‑2

- [ ] Anonymous Explore shows upcoming by default + optional past via toggle.
- [ ] Unlisted never appears in Explore but opens via direct URL.
- [ ] Past event shows Ended + hides RSVP.
- [ ] Signed‑out RSVP triggers auth then returns to same event URL.
- [ ] OG tags render on host + event pages.
