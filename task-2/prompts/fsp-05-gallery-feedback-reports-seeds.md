# FULL STANDALONE PROMPT — paste **entire file** into Lovable as one message

This is prompt 5 of 5. **FSP‑5 — Community & launch:** Gallery + post‑event feedback + reporting queue + seeds + hardening

---

You are implementing on **this Lovable project**. **Assume no chat history.** Follow **only** this message.

### EMBEDDED SPEC — Goals / Features / Requirements

- Gallery uploads → **`pending`**; **`host` role** approves/rejects; **approved** only on public event page.
- Feedback allowed **only after `end_at`**, **confirmed attendees**, **one per user per event**, stars **1–5** + optional comment — enforce server‑side.
- Reporting for **events** + **gallery items**; **`host` role** queue scoped to their host; **hide** makes content non‑public (`hidden` status / equivalent).
- Seed deployed demo data: **≥1 host**, **≥1 upcoming published public event**, **≥1 past published public event**.
- Regression hardening across flows: Explore excludes unlisted; ended hides RSVP; waitlist/tickets consistent.

### CANONICAL DATA MODEL + SECURITY

Ensure tables/policies exist for moderation (create or align):

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

**Policies**

- Ensure `gallery_items`, `event_feedback`, `reports` policies match moderation flows (hosts moderate **their** host’s content).

### INTEGRATION RULE

Seed safely (no secrets). Prefer SQL seed or admin seed route documented.

### THIS FSP‑5 SCOPE — Implement completely

1. Gallery upload + host moderation UI + public visibility rules.
2. Feedback UI + RPC/policy guards for timing + uniqueness + attendee eligibility.
3. Report creation UI + host moderation queue + hide/dismiss.
4. Seeds + deployment sanity fixes surfaced during QA.

### ACCEPTANCE CHECKLIST — FSP‑5

- [ ] Pending gallery hidden publicly; approved visible.
- [ ] Feedback blocked before end; allowed after end for confirmed attendees.
- [ ] Reports queue works; hide suppresses public view.
- [ ] Seeds satisfy submission minimums; manual smoke test passes.
