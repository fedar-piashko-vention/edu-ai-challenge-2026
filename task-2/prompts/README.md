# Lovable — full standalone prompts (FSP)

Paste one file at a time into Lovable (entire file = one message). Order matters. Prompt bodies are plain text (minimal Markdown) to save tokens; Lovable treats them as instructions, not rendered docs.

| Order | File | Focus |
|------:|------|--------|
| 1 | [`fsp-01-foundation.md`](fsp-01-foundation.md) | Schema, RLS baseline, host onboarding, public host page, event editor |
| 2 | [`fsp-02-explore-event-pages.md`](fsp-02-explore-event-pages.md) | Explore, event detail, ended UI, RSVP auth return URL, OG metadata |
| 3 | [`fsp-03-rsvp-waitlist-tickets.md`](fsp-03-rsvp-waitlist-tickets.md) | RSVP, FIFO waitlist, promotions, tickets, QR, calendar, My Tickets |
| 4 | [`fsp-04-roles-dashboard-csv-checkin.md`](fsp-04-roles-dashboard-csv-checkin.md) | Invites, roles, dashboard, CSV, My Events, check‑in |
| 5 | [`fsp-05-gallery-feedback-reports-seeds.md`](fsp-05-gallery-feedback-reports-seeds.md) | Gallery moderation, feedback, reports queue, seeds, hardening |
| 6 | [`fsp-06-final-qa-handoff.md`](fsp-06-final-qa-handoff.md) | Final regression pass mapped to FSP-1–5, fixes only, QA summary |

Paste FSP-6 after FSP-5; it does not add product scope—it audits and plugs gaps before submission.

**Maintenance:** DDL text is mirrored in each FSP for one‑paste independence; edit [`_canonical-schema.md`](_canonical-schema.md) first, then sync copies inside each `fsp-*.md`.

**Normative requirements:** [`../LOVABLE_PROMPT_PLAYBOOK.md`](../LOVABLE_PROMPT_PLAYBOOK.md) Part 1.

---

## Remediation prompts (Gather / community-events-hub audit follow-ups)

Use after FSP-1–6 or when aligning the cloned Lovable app to FSP gaps. Paste one file per message unless noted.

| ID | File | Issue |
|----|------|--------|
| A | [`fix-a-csv-email-rpc.md`](fix-a-csv-email-rpc.md) | CSV export must include real emails via SECURITY DEFINER RPC |
| B | [`fix-b-host-only-export-route-guards.md`](fix-b-host-only-export-route-guards.md) | Checker must not export or use host-only routes |
| C | [`fix-c-login-redirect-allowlist.md`](fix-c-login-redirect-allowlist.md) | Same-origin redirect allowlist after login |
| D | [`fix-d-host-page-event-links.md`](fix-d-host-page-event-links.md) | Public host page: link events to /e/[slug] |
| E | [`fix-e-my-events-host-filter.md`](fix-e-my-events-host-filter.md) | My Events: filter dropdown by Host |
| F | [`fix-f-report-anon-or-signin.md`](fix-f-report-anon-or-signin.md) | Report flow for anonymous vs sign-in gate |
| G | [`fix-g-dashboard-terminology.md`](fix-g-dashboard-terminology.md) | Dashboard vs manage copy / upcoming-past clarity |
| H | [`fix-h-rerun-fsp06-qa.md`](fix-h-rerun-fsp06-qa.md) | Re-run final QA: combine with `fsp-06-final-qa-handoff.md` in one message |
