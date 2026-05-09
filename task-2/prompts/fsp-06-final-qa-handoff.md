FULL STANDALONE PROMPT — paste entire file into Lovable as one message.

This is prompt 6 of 6. FSP-6 — Final QA & fixes: regressions, checklist, polish. No new scope unless gaps block acceptance.

Assume no chat history beyond this codebase. Extend this repo; do not wipe features. Prefer small fixes over rewrites.

GOAL
Run a single pass against the FSP contract: fix regressions RLS/route bugs, mismatched counts, and broken flows; deploy must stay working. Produce a concise CHANGELOG/QASUMMARY comment in-repo (e.g. QASUMMARY.md or QA_NOTES.md) listing PASS/FAIL per numbered check below before fixes, then PASS after — or omit if nothing failed.

REFERENCE — product must satisfy (verify / fix)

FSP-1: Host onboarding; public /h/[slug] lists published+public only; event editor draft/publish/unpublish/duplicate; visibility public vs unlisted; Free/Paid visible, Paid disabled, tooltip Coming Soon; schema + RLS not leaking drafts to anonymous.

FSP-2: /explore — published public only; filters (search, date range default upcoming, location, Include Past); unlisted never in Explore; direct URL loads unlisted; past events Ended; RSVP hidden when ended; signed-out RSVP → auth → return same event URL; OG tags on Host + Event.

FSP-3: RSVP capacity + FIFO waitlist; promote on cancel and on capacity increase; in-app promotion notification; ticket_code unique; QR shows code; calendar .ics; My Tickets upcoming only; cancel RSVP.

FSP-4: host vs checker enforced server-side; invite links add role; dashboard Going/Waitlist/Checked-in; CSV UTF-8 BOM columns name,email,RSVP status,check-in time; My Events filters + actions; checker check-in manual code, duplicates blocked, undo last by this checker for event, counters live.

FSP-5: gallery pending→host approve→public only; feedback only after end, confirmed attendees once per event 1–5 stars; reports queue host can hide; seeds: ≥1 host, ≥1 upcoming published public event, ≥1 past published public event on deployed preview.

YOUR TASK — implement fixes only where checks fail

1. Walk codebase + deployed URL (if available) mentally or via tooling; validate each numbered area.
2. For each FAIL: smallest fix migrations/RLS/routes/UI/tests.
3. Optional: add 1 smoke test suite or scripted checklist (Playwright/smoke routes) only if trivial in this stack — not required but welcome.
4. Re-verify full checklist; ensure no TypeScript/supabase errors blocking build.

ACCEPTANCE — all must PASS after this pass

- Anonymous can browse Explore and open past/public events where rules allow.
- Unlisted excluded from Explore; direct link works.
- Past shows Ended; no RSVP UI.
- RSVP auth return URL works logged out when clicking RSVP/cancel path.
- Waitlist FIFO + promotion on cancel/increase capacity + promotion visible.
- Ticket QR/calendar/My Tickets/cancel coherent.
- Checker cannot access host management; checker check-in dupes blocked + undo.
- CSV BOM + column names as specified exports from host UX.
- Gallery/feedback/report/hardening + seeds visible on deployed app as per FSP-5.
- Paid disabled + tooltip intact.
- Produce QASUMMARY or QA_NOTES briefly (checks + fixes).
