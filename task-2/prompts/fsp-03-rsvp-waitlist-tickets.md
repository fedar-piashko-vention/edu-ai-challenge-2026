FULL STANDALONE PROMPT — paste entire file into Lovable as one message.

This is prompt 3 of 5. FSP-3 — RSVP & tickets: RSVP + FIFO waitlist + promotions + tickets + QR + calendar + My Tickets + cancel + notifications

You are implementing on this Lovable project. Assume no chat history. Follow only this message.

EMBEDDED SPEC — Goals / Features / Requirements
- Capacity enforced; overflow FIFO waitlist.
- Promote automatically when seats open due to cancellation or host increases capacity.
- Promotion visible in-app (user_notifications).
- Ticket has unique ticket_code; QR encodes only that code.
- Add to calendar (.ics acceptable).
- My Tickets shows upcoming confirmations only.
- RSVP requires auth; respect Ended / draft / unpublished rules.

Whole-product context
- Free community events platform with Explore (public only), unlisted direct links, host/checker roles, dashboard exports, gallery moderation, reporting — do not regress prior surfaces while implementing RSVP/tickets.

CANONICAL DATA MODEL + SECURITY
Align migrations/RLS with this baseline (create if missing):
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

Implement SECURITY DEFINER RPC functions as needed, e.g. attempt_rsvp(event_id), cancel_rsvp(event_id), internal promote_next_waitlist(event_id).
RLS should either deny direct writes to RSVP/ticket tables or gate them tightly — avoid client-only capacity logic.

INTEGRATION RULE
Do not break Explore/Event pages; extend.

THIS FSP-3 SCOPE — implement completely
1. RSVP UX on /e/[slug] for signed-in users on eligible events.
2. Concurrency-safe capacity counting (confirmed seats vs capacity).
3. Waitlist enqueue FIFO (queued_at).
4. Ticket issuance/revocation tied to RSVP transitions; show QR + download .ics.
5. /tickets or /my-tickets upcoming list + cancel action.
6. Notifications UI for promotion events.

ACCEPTANCE CHECKLIST — FSP-3
- At capacity, next RSVP becomes waitlisted in FIFO order.
- Cancel promotes next; capacity increase promotes correctly.
- QR + calendar + My Tickets + cancel works end-to-end.
- Promoted user sees notification.
