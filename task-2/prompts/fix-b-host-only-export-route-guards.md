REMEDIATION PROMPT — paste entire file into Lovable as one message.

Target: Gather / community-events-hub.

PROBLEM
Checker role users must not export RSVP lists or use host management surfaces. Today /h/$hostSlug/manage may be reachable for checkers; client export used event_rsvps readable by any host_member per RLS.

TASK
1) Add route-level guard: if current user’s membership for host slug is role=checker, redirect to /my-events (or 403) when visiting /h/$hostSlug/manage, /h/$hostSlug/events/new, /h/$hostSlug/events/$eventId/edit, /h/$hostSlug/members, /h/$hostSlug/moderation.

2) Optionally tighten RLS: change event_rsvps (and related) SELECT policies so only host role (not checker) can read others’ RSVPs for that host’s events—checkers keep only what check-in RPC needs, or route all sensitive reads through SECURITY DEFINER RPCs used only on host pages.

Ensure checkers still access /check-in/$eventId from My Events.

ACCEPTANCE
Checker account cannot open manage/edit/members/moderation URLs; cannot obtain CSV. Host account unchanged.
