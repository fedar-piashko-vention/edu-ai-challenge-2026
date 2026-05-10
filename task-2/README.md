# Task 2 — Gather (Lovable) prototype

## Objective

End-to-end **free community events** prototype: hosts publish events, attendees RSVP and receive tickets with QR codes, check-in staff validate entry. Built primarily via **Lovable** using standalone prompts in [`prompts/README.md`](prompts/README.md); playbook and spec in [`LOVABLE_PROMPT_PLAYBOOK.md`](LOVABLE_PROMPT_PLAYBOOK.md).

**Live deployment:** [https://eventswise.lovable.app/](https://eventswise.lovable.app/)

## Usage guide (main flows)

Use this as a **hands-on walkthrough** for demos and grading—not a requirements checklist.

### Before you start

1. Open the app at **[https://eventswise.lovable.app/](https://eventswise.lovable.app/)** (or your fork’s deploy URL).
2. Use a **modern browser** with JavaScript enabled.
3. **Sign up** or **sign in**—RSVP and anything under “My …” needs an account.

---

### Flow A — Publish an event (Host)

1. **Become a host**  
   After login, open **Dashboard** (or **My hosts**). If you have no host yet, use **Create a host** (onboarding): **name**, **slug**, optional **logo**, **bio**, **contact email**, then submit.

2. **Open manage**  
   From the dashboard, choose your host → **Manage** (`/h/{host-slug}/manage`). You should see your profile and an **Events** list.

3. **Create an event**  
   Click **New event**. Fill **title**, **slug**, **description**, optional **cover image**, **start/end** (with timezone), **venue** or **online link**, **capacity**, **visibility** (public vs link-only), leave **Draft** or prepare to publish.

4. **Publish**  
   Use **Publish** when validation passes (published events need complete time range and a venue or link). **Unpublish** returns it to draft; **Duplicate** copies an event as a new draft.

5. **Share**  
   Copy the public **event URL** (`/e/{event-slug}`) or share **Explore** / host page links depending on visibility.

---

### Flow B — RSVP (Attendee)

1. **Find or open an event**  
   Use **Explore** (search, dates, location, optional past events) or open a direct **event link**.

2. **Sign in when prompted**  
   RSVP requires authentication. You’ll be sent to **Login**, then returned to the event page (`redirect` preserved).

3. **Confirm RSVP**  
   On the event page, use **RSVP** / join. If the event is **full**, you join the **waitlist** (FIFO—when someone cancels or capacity increases, the next person can be promoted).

4. **Ended events**  
   Past events show an **Ended** state; RSVP is not offered.

---

### Flow C — Ticket (Attendee)

1. **After a successful RSVP**  
   You receive a **ticket** with a **QR code** (and typically a short manual code).

2. **My Tickets**  
   Open **My Tickets** from the nav to see **upcoming** passes. Use **Add to calendar** if offered.

3. **Cancel**  
   You can cancel an RSVP from this flow where supported—your seat may go to the waitlist.

---

### Flow D — Check-in (Checker)

> Requires **Checker** (or **Host**) membership on that host—not every logged-in user.

1. **Open the check-in route**  
   From host tooling or a shared link, go to **Check-in** for the event (`/check-in/{eventId}` pattern—use the URL your deployment exposes).

2. **Validate attendees**  
   Enter the **manual ticket code** from the attendee’s ticket, or use QR scanning if the UI supports it (**manual entry is sufficient** for the spec).

3. **Live feedback**  
   The page shows **counters** (e.g. checked-in vs capacity). **Duplicate check-ins** are rejected; **undo last check-in** may be available for mistakes.

---

### Optional flows (same app)

| Goal | Where to go |
|------|----------------|
| See events you’re involved with | **My Events** (filters by host, dates, search). |
| Host CSV export | **Manage** → export attendees for an event (**Host** only). |
| Post-event feedback | Event page after **end time**—stars + optional comment (**confirmed** attendees). |
| Gallery | Upload photos post-event; host **Moderation** can approve/reject. |
| Report content | **Report** link on event (signed-in); hosts handle items under **Moderation**. |

---

## Implementation summary

- **Front end:** React + TanStack Router; Supabase JS client for Auth and data under RLS.
- **Back end:** Supabase Postgres with RLS, Storage buckets for logos/covers, RPCs for sensitive exports and moderation actions.
- **Process:** FSP‑1–6 implementation plus remediation prompts **fix‑a … fix‑r** for security and UX hardening (see [`report.md`](report.md)).

## Setup / run (local reference)

If you clone the **Gather** repo separately (e.g. GitHub export from Lovable):

1. **Node.js 24** (see repo `.nvmrc` / package if present).
2. Install deps in the **app directory** (`pnpm install` / `npm install` per project).
3. Copy **`.env`** / **`.env.local`** with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Supabase project settings.
4. Run **`pnpm dev`** / **`npm run dev`** as documented in that repo.

> This challenge workspace intentionally keeps scaffolding **inside `task-2/`** only per repo rules; the canonical app may live in a linked repository.

## Verification checklist (submission)

- [ ] Deployed URL loads and matches demo intent.
- [ ] Publish → RSVP → Ticket → Check-in path exercised manually (see usage guide).
- [ ] Supabase project has Auth URLs and (if used) SMTP aligned with deployment origin.
- [ ] [`report.md`](report.md) reflects actual tooling and decisions.
- [ ] Required announcement artifacts present (links, CSV sample if requested, etc.).

## Submission artifacts

| Item | Location / notes |
|------|------------------|
| **Development report** | [`report.md`](report.md) |
| **This usage guide** | [`README.md`](README.md) (you are here) |
| **Deployed application** | [https://eventswise.lovable.app/](https://eventswise.lovable.app/) — **Gather** (Lovable) |
| **Source repository** | [https://github.com/fedar-piashko-vention/community-events-hub](https://github.com/fedar-piashko-vention/community-events-hub) |
