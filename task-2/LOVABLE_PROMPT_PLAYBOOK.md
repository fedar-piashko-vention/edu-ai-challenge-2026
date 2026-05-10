# Task 2 — Lovable Implementation Playbook

This document contains **(1)** the full Task 2 specification, **(2)** a **requirements → prompts** map, and **(3)** **standalone Lovable prompts**.

### Standalone posting (important)

Lovable chat sessions **do not reliably retain prior prompts**. Treat **every** prompt below as **complete**: each **FULL STANDALONE PROMPT (FSP)** repeats the **same** embedded specification + data model, then states **exactly** what to implement in that step.

**How to use**

1. Pick **FSP‑1 … FSP‑6** in order (**FSP‑6** = final QA / regression only, after features). Each assumes you keep working in the **same** Lovable project; prompts tell Lovable to **inspect what exists** and **extend or fix** without deleting unrelated features.
2. Paste **one FSP per message** (do not split an FSP).
3. After each FSP, run its **Acceptance checklist** before moving on.

---

## Part 1 — Full task instructions (source specification)

### Mission

Use **Lovable** to build and deploy a web application **from scratch**.

### Product goal

Build a **lightweight event hosting and attendance platform** — a tool for running **free community-style events** end to end. Organizers publish an **event page** and share it publicly. Attendees **confirm attendance** and receive a **digital pass**. The tool should support **turnout and entry at the venue**, and capture **basic post-event outcomes**.

---

### Application features

#### Core publishing and hosting

- Any user can register as a **Host** via a **self-serve** flow.
- **Host profile** includes: **name**, **logo**, **short bio**, and **contact email**, with a **public Host page**.
- **Event creation** supports: **title**, **description**, **start and end date/time with time zone**, **venue address or online link**, **capacity**, and **cover image**.
- Events can be **Public** (searchable) or **Unlisted** (link-only), and exist in **Draft** or **Published** state with **Publish**, **Unpublish**, and **Duplicate** actions.
- A **Free/Paid** toggle is visible in the event editor; the **Paid** option is **disabled** with a **“Coming soon”** tooltip.

#### Discovery and sharing

- An **Explore** page allows browsing events with **text search**, **date range filter** (**Upcoming** by default), **location filter**, and an **“Include Past”** toggle.
- **Past** events display a clear **“Ended”** state; the **RSVP** option is **hidden**.
- **Event** and **Host** pages include **social preview metadata** for shareable links.

#### RSVP and tickets

- **RSVP requires sign-in**; unauthenticated users are **redirected to sign-in** and **returned to the event page** afterward.
- **Capacity** is enforced; RSVPs beyond capacity go to a **waitlist**.
- **Confirmed** attendees receive a **ticket** with a **unique QR code** and an **“Add to Calendar”** option.
- Attendees can **cancel** their RSVP; a **“My Tickets”** page shows **all upcoming** tickets.

#### Waitlist

- Waitlist is **FIFO**; the **next person in queue** is **automatically promoted** when a seat opens due to a **cancellation** or **capacity increase**.
- **Promotion** is **visible in-app** to the affected attendee.

#### Roles and permissions

- Each Host supports two member roles: **Host** and **Checker**.
- Hosts can **invite members by role** via a **copyable link**.
- **Host** role covers **all management** actions: creating and managing events, **approving gallery uploads**, viewing the **dashboard**, and **exporting CSVs**.
- **Checker** role is limited to accessing the **check-in page** for events under that Host.

#### Host dashboard and operations

- **Host dashboard** lists **Upcoming** and **Past** events with per-event stats: **Going**, **Waitlist**, and **Checked-in** counts.
- **CSV export** is available for **RSVPs** and **attendance**, with columns: **name**, **email**, **RSVP status**, and **check-in time**. Exported files must open correctly in **Excel** and **Google Sheets**.
- A **“My Events”** page aggregates **all events** where the user holds a role, with filters by **Host**, **date range**, and **text search**, and **role-appropriate** quick actions.

#### Check-in page

- A **Checker** can open the **check-in page** for an event and **scan QR codes** or **enter codes manually**. QR codes must be generated for each ticket; **scanning with a camera is not required** — **manual code entry is sufficient**.
- The page shows **live counters**, **prevents duplicate check-ins**, and supports **undoing the last scan**.

#### Community content and feedback

- Attendees can submit **post-event feedback** after the event ends: a **1–5 star** rating plus an **optional comment**.
- Attendees can **upload photos** to an **event gallery**; uploads require **Host approval** before being displayed publicly.
- Any user can **report** an **event** or **photo**; reported items appear in a **review queue** and can be **hidden**.

---

### Requirements — application behavior

- **Unauthenticated** users can **browse all events**, **including past ones**.
- Clicking **RSVP** when signed out prompts **sign-in** and **returns** to the **event page** afterward.
- **Signed-in** users can **register as a Host**, create and publish **Public** or **Unlisted** **free** events, and manage them from the **Host dashboard**.
- **Signed-in** users can **RSVP**, immediately view a **unique QR ticket**, **add the event to their calendar**, **cancel** their RSVP, and view **upcoming tickets** on a **Tickets** page.
- When capacity is reached, new RSVPs go to the **waitlist**; the **next person** is **promoted automatically** when a seat opens.
- A **Checker** can open the **check-in page**, **enter codes manually**, view **live counters**, avoid **duplicate** scans, and **undo the last scan**.
- **Gallery uploads** require **Host approval** before public display; **post-event feedback** is available **after** the event ends.
- The **Report** flow surfaces reported items in a **review list**; they can be **hidden** from public view.
- **“My Events”** is visible to users **with roles** and aggregates their events with filters and **appropriate** quick actions.
- The **event editor** shows the **Free/Paid** toggle with **Paid disabled** and an explanatory **tooltip**.
- **Past** event pages clearly show **“Ended”** and **hide** the **RSVP** option.

---

### Submission artifacts

- A **shareable public URL** to a **working deployed** application.
- The deployed app must have **at least one Host**, **one upcoming event**, and **one past event** **seeded**.
- **At least one example CSV export file** demonstrating the **correct schema**.
- A **`report.md`** in your repository covering: **tools and techniques** used, **what worked**, **what did not**, and **notable decisions**.
- A **step-by-step README** explaining the main flows: **Publish → RSVP → Ticket → Check-in** (usage guide, **not** a copy of requirements).
- Your **GitHub repository** must be **public**, with the project placed in a **`task-2`** folder.

---

### Compensation note (prompt efficiency)

Compensation references **efficient prompting**. Each FSP repeats a compact embedded spec so messages stay **self-contained**; you avoid brittle follow‑ups because the contract is fixed.

---

## Part 2 — Requirements ↔ prompts map (standalone FSPs)

| ID | Requirement area | Covered by FSP |
|----|------------------|----------------|
| R1 | Anonymous browse all events (incl. past) | FSP‑2 |
| R2 | RSVP gated auth + return URL | FSP‑2, FSP‑3 |
| R3 | Host self-serve + public Host profile | FSP‑1 |
| R4 | Event fields, draft/published, public/unlisted, duplicate | FSP‑1 |
| R5 | Free/Paid toggle (Paid disabled + tooltip) | FSP‑1 |
| R6 | Explore filters + Include Past + Ended + hide RSVP | FSP‑2 |
| R7 | Social preview metadata (Host + Event) | FSP‑2 |
| R8 | Capacity + waitlist FIFO + auto-promote + visibility | FSP‑3 |
| R9 | Ticket QR + calendar + cancel + My Tickets | FSP‑3 |
| R10 | Host vs Checker roles + invite links | FSP‑4 |
| R11 | Dashboard stats + CSV exports | FSP‑4 |
| R12 | “My Events” aggregate + filters + actions | FSP‑4 |
| R13 | Check-in manual code, counters, dupes, undo last | FSP‑4 |
| R14 | Post-event feedback | FSP‑5 |
| R15 | Gallery + Host approval | FSP‑5 |
| R16 | Report + queue + hide | FSP‑5 |
| R17 | Deploy seeds (1 host, 1 upcoming, 1 past) + polish | FSP‑5 |
| R18 | Full FSP regression QA + fixes + handoff summary | FSP‑6 |

**Traceability**

- **Part 1** (Goals, Application features, Requirements — application behavior, Submission artifacts) is the **normative source**. Each FSP’s **EMBEDDED SPEC** is an **operational distillation** you paste into Lovable so the model has full intent **without chat memory**.
- If anything ever conflicts, **reconcile toward Part 1**.

---

## Part 3 — Standalone prompt architecture

Each **FULL STANDALONE PROMPT** contains:

1. **`EMBEDDED SPEC`** — goals, features, requirements, non‑goals (whole‑product contract).
2. **`CANONICAL DATA MODEL + SECURITY`** — tables, enums, RLS/RPC intent (so Lovable can create or reconcile migrations).
3. **`THIS FSP SCOPE`** — what to build **now**, without relying on chat memory.
4. **`INTEGRATION RULE`** — merge into the existing Lovable project; **do not** wipe unrelated work; **fix contradictions** toward the embedded spec.
5. **`ACCEPTANCE CHECKLIST`** — binary verification steps.

---

## Part 4 — FULL STANDALONE PROMPTS (Lovable paste payloads)

Prompt bodies live in **`task-2/prompts/`** so you copy **one whole file per Lovable message** (do not paste this playbook into Lovable). Those files use **plain, dense text** (almost no Markdown decoration) so pasted tokens stay smaller; Lovable does not need headings/bold for comprehension.

**Index:** [`prompts/README.md`](prompts/README.md)

| FSP | File |
|-----|------|
| FSP‑1 | [`prompts/fsp-01-foundation.md`](prompts/fsp-01-foundation.md) |
| FSP‑2 | [`prompts/fsp-02-explore-event-pages.md`](prompts/fsp-02-explore-event-pages.md) |
| FSP‑3 | [`prompts/fsp-03-rsvp-waitlist-tickets.md`](prompts/fsp-03-rsvp-waitlist-tickets.md) |
| FSP‑4 | [`prompts/fsp-04-roles-dashboard-csv-checkin.md`](prompts/fsp-04-roles-dashboard-csv-checkin.md) |
| FSP‑5 | [`prompts/fsp-05-gallery-feedback-reports-seeds.md`](prompts/fsp-05-gallery-feedback-reports-seeds.md) |
| FSP‑6 | [`prompts/fsp-06-final-qa-handoff.md`](prompts/fsp-06-final-qa-handoff.md) |

**Canonical DDL snapshot (edit once, sync copies inside each `fsp-*.md`):** [`prompts/_canonical-schema.md`](prompts/_canonical-schema.md)

**Post-audit remediation (e.g. Gather / community-events-hub):** [`prompts/README.md`](prompts/README.md) — section *Remediation prompts* (`fix-a` … `fix-r`). **fix-o** merges former **fix-o** (URLs/seeds) + **fix-p** (anon Storage read); **fix-p** removed; **fix-n** is standalone (anon Explore RLS only).

**Human instructions**

1. Open the next `fsp-*.md`, **Select All**, paste into Lovable as **one** message.
2. Run that file’s **Acceptance checklist** before continuing.
3. **Optional redundancy:** if Lovable drifts, paste Part 1 sections **Application features** and **Requirements — application behavior** **above** the file contents in the same message.

---

## Part 5 — Optional ultra‑short capsule (not sufficient alone)

```text
Free events platform: Explore excludes unlisted; RSVP auth+return; waitlist FIFO+promote+notify; ticket QR+ics; roles host/checker+invites; dashboard+CSV BOM columns name/email/RSVP status/check-in time; check-in duplicate block+undo; gallery approve; post-event feedback; reports hide; Paid disabled tooltip.
```

---

## Part 6 — Repository artifacts (outside Lovable)

After the app works, in `task-2/` also add:

- `report.md` — tools/techniques, what worked/didn’t, decisions.
- `README.md` — **usage guide**: Publish → RSVP → Ticket → Check-in (not requirements clone).
- Example CSV export file committed (from real export).
- Public GitHub repo layout including `task-2/` as required.

These are **human-maintained** documents/files; Lovable may assist, but submission ownership is yours.
