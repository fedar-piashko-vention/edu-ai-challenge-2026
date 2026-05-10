REMEDIATION PROMPT — paste entire file into Lovable as one message.

Target: Gather / community-events-hub (TanStack Start + Supabase).

PROBLEM
useRequireHostRole(hostSlug) already returns a boolean `ready` once the user is verified as host-role for that slug. Several routes call the hook but ignore `ready` and run data-loading useEffect on mount immediately. A checker (or non-member) briefly triggers Supabase reads (host profile, events, counts, moderation lists) before navigate() fires—unnecessary leakage and UI flash. The edit-event route fetches the full event row in useEffect even while `ready` is still false; only the JSX was gated.

SCOPE (no new features—hardening only)

1) src/routes/_authenticated/h.$hostSlug.manage.tsx
- Change to: `const ready = useRequireHostRole(hostSlug);`
- Do not call `load()` until `ready === true`. Use `useEffect` with deps `[ready, hostSlug]` that runs `load()` only when `ready` is true.
- While `!ready`, render the same neutral loading line as today (no manage form, no event cards).

2) src/routes/_authenticated/h.$hostSlug.members.tsx
- Same: capture `ready`; defer the entire `load()` (host, members, invites) until `ready === true`.
- While `!ready`, show loading placeholder only.

3) src/routes/_authenticated/h.$hostSlug.moderation.tsx
- Same: capture `ready`; defer `load()` until `ready === true`.
- While `!ready`, show loading only.

4) src/routes/_authenticated/h.$hostSlug.events.$eventId.edit.tsx
- Capture `ready`.
- Change the useEffect that selects from `events`: do not query until `ready === true` (guard at top: `if (!ready) return`).
- Dependencies: `[ready, hostSlug, eventId]` (omit hostSlug if unused in fetch).
- Keep final render guard `if (!ready || !draft) return loading…`.

5) Optionally align naming: hooks file comment already documents `ready`—ensure all host-only pages use `const ready = useRequireHostRole(...)` for consistency.

ACCEPTANCE
- Opening /h/[checker-host]/manage (or members/moderation) as a checker: no host/events/members payloads requested before redirect (verify in DevTools Network or by temporary console log if needed during dev—remove logs after).
- Host user: after loading spinner, Manage/Members/Moderation/Edit behave exactly as before.
- No regressions to New Event page (already gates on ready).
