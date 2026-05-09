REMEDIATION PROMPT — paste entire file into Lovable as one message.

Target: Gather / community-events-hub.

PROBLEM
Spec: any user can report an event or photo. submit_report RPC requires auth; anonymous users get errors on “Report this event”.

TASK (pick one approach and implement fully)

OPTION 1 — Sign-in gate (smaller change)
Replace one-click report for signed-out users with button “Sign in to report” linking to /login?redirect=current event URL. Keep one-click for signed-in. Document in UI. Gallery report same pattern.

OPTION 2 — Anonymous reports (larger)
Allow reporter_user_id null in reports; new RPC or extend submit_report for anon with optional text note; RLS insert policy for anon via RPC only; rate limit by IP or use captcha if available; host queue unchanged.

State which option you implemented in a one-line code comment.

ACCEPTANCE
No broken report button for signed-out users; behavior matches chosen option; host moderation queue still works.
