FULL STANDALONE PROMPT — paste entire file into Lovable as one message.

Six self-contained prompts total (FSP-6 is final QA only); extend this repo; do not delete unrelated features.

This is prompt 1 of 6. FSP-1 — Foundation: schema + RLS + Host onboarding + Event editor

You are implementing a deployed web app from scratch or on top of whatever exists in this Lovable project. Assume no chat history. Follow only this message.

EMBEDDED SPEC — Goals
Build a lightweight event hosting and attendance platform for free community-style events. Organizers publish event pages; attendees RSVP and receive a digital pass (ticket); hosts manage turnout, waitlists, check-in, light post-event feedback, gallery moderation, and reports.

EMBEDDED SPEC — Features (whole product; implement FSP-1 slice now)

Publishing
- Self-serve Host registration.
- Host profile: name, logo, short bio, contact email; public Host page.
- Events: title, description, cover image, start/end with timezone, venue address OR online link, capacity.
- Events: Draft/Published with Publish, Unpublish, Duplicate.
- Visibility: Public (searchable in Explore) vs Unlisted (never listed in Explore; direct link only).
- Editor shows Free/Paid toggle; Paid disabled with tooltip "Coming soon" (no real payments).

Discovery
- Explore: text search, date range (default Upcoming), location filter, Include Past toggle.
- Past events show Ended; RSVP hidden on ended event pages.

RSVP / tickets / waitlist
- RSVP requires sign-in; signed-out RSVP redirects to auth then returns to the same event URL.
- Capacity enforced; overflow goes to FIFO waitlist.
- Auto-promote next waitlist user when a seat opens (cancellation or capacity increase); promotion visible in-app.
- Confirmed attendees get ticket with unique code, QR encoding that code, Add to calendar.
- My Tickets lists upcoming tickets; attendee can cancel RSVP.

Roles
- Per host: Host vs Checker; invite via copyable link.
- Host: events, dashboard, exports, gallery approvals, moderation queue.
- Checker: check-in only for that host’s events.

Operations
- Host dashboard: upcoming/past lists; per event counts Going, Waitlist, Checked-in.
- CSV exports: columns name, email, RSVP status, check-in time; UTF-8 BOM; Excel and Google Sheets friendly.
- My Events for any user with a role: aggregate events; filters: host, date range, text search; actions depend on role.

Check-in
- Manual ticket code entry sufficient (camera scan optional).
- Live counters; block duplicate check-ins; undo last scan (define clearly in UI copy).

Community
- After event ends: 1–5 star feedback + optional comment.
- Gallery uploads require Host approval before public display.
- Any user can report event or photo; host review queue can hide public content.

EMBEDDED SPEC — Requirements (behavioral acceptance)
- Unauthenticated users can browse published events (Explore rules + direct links), including past.
- Signed-in users can become hosts and manage free public/unlisted events.
- Past pages: Ended + no RSVP.
- Sensitive rules enforced server-side (RLS / RPC), not UI-only.

CANONICAL DATA MODEL + SECURITY (implement now; reconcile if tables exist)
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

RLS intent (implement now for tables touched in FSP-1; stub permissive policies only if unavoidable and document follow-ups)
- Authenticated users can manage their profile.
- Host role host can CRUD their host’s events (draft visibility restricted to members).
- Public read policies must not leak draft events to non-members.
- checker role must not gain host-only privileges (narrow checker policies in FSP-4).

INTEGRATION RULE
Inspect existing migrations/UI. Prefer altering to match this canonical model over deleting the project. Do not remove unrelated routes unless they conflict; resolve conflicts in favor of this spec.

THIS FSP-1 SCOPE — implement completely
1. All migrations for tables above (create if missing; align if partial).
2. Bootstrap membership: creating a host must insert host_members row with role=host for owner_user_id.
3. Host onboarding UI: create/edit host profile fields; enforce unique slug.
4. Public Host page /h/[slug]: shows profile; lists published + public events for that host (hide drafts and hide unlisted from this listing).
5. Events UI for Host role: full editor fields listed above; Draft/Published workflow + Duplicate (duplicate creates draft, clears attendee artifacts if copying from an existing event); visibility toggle; Free/Paid toggle UI: Paid disabled + tooltip Coming soon; persist free.

ACCEPTANCE CHECKLIST — FSP-1
- Tables + RLS exist; host owner becomes host_members.role=host automatically.
- Host can CRUD profile; public host page works logged out.
- Host can CRUD events; publish/unpublish/duplicate works.
- Paid toggle visible, disabled, tooltip correct.
