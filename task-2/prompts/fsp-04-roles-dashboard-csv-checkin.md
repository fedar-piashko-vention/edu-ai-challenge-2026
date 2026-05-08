FULL STANDALONE PROMPT — paste entire file into Lovable as one message.

This is prompt 4 of 5. FSP-4 — Roles & operations: Roles & invites + Host dashboard + CSV exports + My Events + Checker check-in

You are implementing on this Lovable project. Assume no chat history. Follow only this message.

EMBEDDED SPEC — Goals / Features / Requirements
- host role: manage events, dashboard, exports, approvals/moderation pages (even if built later).
- checker role: check-in page access only for that host’s events (plus minimal reads needed).
- Invite links (opaque token) create host_members.
- Dashboard upcoming/past + counts Going / Waitlist / Checked-in consistent with FSP-3 definitions.
- CSV columns name,email,RSVP status,check-in time, comma-separated, UTF-8 BOM.
- My Events aggregated memberships + filters + role-appropriate actions.
- Check-in: manual ticket code; prevent duplicates; live counters (poll OK); undo last check-in by this checker for this event (document).

Whole-product context
- Free community events platform; Explore excludes unlisted; RSVP/tickets/waitlist already exist — preserve them.

CANONICAL DATA MODEL + SECURITY
Ensure baseline tables exist; tighten RLS + route guards so checker cannot access host management URLs:
Use Supabase or equivalent with RLS. Store event times as timestamptz (UTC); store timezone as an IANA string for display and calendar exports.

Tables (minimum columns)
- profiles: id (PK = auth user id), full_name, avatar_url, timestamps.
- hosts: id, owner_user_id, slug (unique), name, logo_url, bio, contact_email, timestamps.
- host_members: id, host_id, user_id, role (host|checker), unique (host_id,user_id).
- host_invites: id, host_id, role, token (unique), expires_at, optional max_uses, uses_count.
- events: id, host_id, slug (unique per host OR globally unique — pick one and enforce), title, description, cover_image_url, start_at, end_at, timezone, venue_text nullable, online_url nullable, business rule: published events should have at least one of venue/online (enforce in editor/RPC), capacity int > 0, visibility (public|unlisted), status (draft|published), pricing defaults to free.
- event_rsvps: id, event_id, user_id, status (confirmed|waitlisted|cancelled), timestamps; enforce one active RSVP per user/event (unique partial index where status in (confirmed,waitlisted) or equivalent).
- waitlist_entries: id, event_id, user_id, queued_at (FIFO), unique (event_id,user_id) for active rows.
- tickets: id, event_id, user_id, ticket_code (globally unique recommended), timestamps, revoked_at nullable.
- check_ins: id, event_id, ticket_id unique, checked_in_at, optional checked_in_by_user_id.
- gallery_items: id, event_id, created_by, image_url, status (pending|approved|rejected|hidden).
- event_feedback: id, event_id, user_id, stars int 1–5, comment nullable, created_at, unique (event_id,user_id).
- reports: id, target_type (event|gallery_item), target_id (uuid), host_id denormalized for queue scoping, reporter_user_id, status (open|hidden|dismissed), created_at.
- user_notifications: id, user_id, type, payload json/text, read_at nullable, created_at.

INTEGRATION RULE
Preserve prior features; add operational surfaces.

THIS FSP-4 SCOPE — implement completely
1. Invite issuance + acceptance flows + membership management UI for host role.
2. Host dashboard UI + aggregates.
3. CSV export per event for host role.
4. /my-events filters + actions by role.
5. Checker /check-in/[eventId] flow + undo + counters.

ACCEPTANCE CHECKLIST — FSP-4
- Checker blocked from host-only surfaces (server enforced).
- Invite adds intended role.
- Dashboard numbers match DB on sample rows.
- CSV opens correctly in Excel/Sheets with BOM + headers.
- Check-in duplicate blocked; undo works per defined scope.
