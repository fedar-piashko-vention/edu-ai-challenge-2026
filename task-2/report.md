# Task 2 — Development report

This report summarizes **tools and techniques** used to produce the Gather-style event platform via **Lovable**, **what worked**, **what did not**, and **notable decisions**. The implementation followed standalone full-stack prompts (**FSP‑1 … FSP‑6**) and post-audit remediation prompts (**fix‑a … fix‑r**) documented in [`prompts/README.md`](prompts/README.md).

---

## Tools and techniques

### Primary toolchain

| Area | Choice | Role |
|------|--------|------|
| **Product build** | **Lovable** | AI-assisted generation of React UI, routes, and Supabase integration from pasted FSP/remediation prompts. |
| **Backend** | **Supabase** | Postgres with **RLS**, **Auth**, **Storage** (public buckets for logos/covers), optional **Realtime** (later simplified). |
| **App shell** | **TanStack Router** (+ Start where applicable) | File-based routes, loaders, typed search params, authenticated layouts. |
| **Client** | **React** + **TypeScript** | Hooks for auth state, Supabase browser client for RLS-aware reads/writes. |

### Engineering patterns

1. **Standalone prompts (FSP)**  
   Each FSP repeats enough schema and acceptance criteria to paste **one message at a time** without relying on chat memory—critical because Lovable sessions do not reliably retain prior context.

2. **Security-definer RPCs**  
   Used where plain `SELECT` under RLS would recurse or leak data: **`is_host_member`**, **`host_public_by_slug` / `host_public_by_id`** (safe public host projection), **`export_event_attendees_rows`** (CSV with emails), **`submit_report`**, **`resolve_report`**, **`moderate_gallery_item`**, RSVPs/tickets aggregation helpers.

3. **RLS + function privileges**  
   Policies that call **`is_host_member(...)`** require the **JWT role** (**`authenticated`**) to have **`EXECUTE`** on that function—revoking it from **`authenticated`** breaks inserts that re-select rows (e.g. `POST …?select=id`). Policies intended only for logged-in users must use **`TO authenticated`** so **`anon`** never evaluates expressions that call helpers **`EXECUTE`** is denied for (**Explore** as anonymous).

4. **Storage paths tied to ownership**  
   **`host-logos`** and **`event-covers`** uploads use **`{host_id}/…`** and **`{event_id}/…`** prefixes so **`storage.objects`** policies can join **`hosts` / `events`** and **`is_host_member(..., 'host')`** without trusting arbitrary paths.

5. **Remediation loop**  
   After security tightening (drop broad **`storage.objects` SELECT**, tighten **`hosts`** reads), follow-up migrations and prompts restored **anonymous read** on **public** buckets for `<img>` URLs (browser requests Storage **without** a Supabase JWT).

---

## What worked well

- **Ordered FSP delivery** (foundation → explore → RSVP/tickets → dashboard/CSV → gallery/reports → QA) kept scope aligned with scoring checkpoints.
- **Explicit remediation prompts** (**fix‑k … fix‑o**, etc.) gave repeatable instructions for Supabase-only fixes (grants, policy **`TO`**, seed URLs, Storage **`SELECT`**).
- **Branching sign-up UX on `signUp` session**: when email confirmation is off, treating **`data.session`** as “signed in immediately” avoids misleading “check your email” copy (`fix‑q` pattern).
- **Host vs Checker routing** via **`useRequireHostRole`** clarified who could open manage vs check-in surfaces.

---

## What did not work or caused friction

1. **`REVOKE EXECUTE` on `is_host_member` from `authenticated`**  
   Intended to lock down direct RPC abuse, it **broke RLS evaluation** for normal API calls until **`GRANT EXECUTE … TO authenticated`** was restored (**fix‑k** lesson).

2. **Broad member `SELECT` policies applying to `anon`**  
   **`events_select_members`** without **`TO authenticated`** forced **`anon`** to evaluate **`is_host_member`** → **`42501`** on Explore (**fix‑n**).

3. **Dropped Storage `SELECT` policies**  
   Uploads could succeed while **public pages showed broken images** until **`host_logos_public_read` / `event_covers_public_read`** were re-added for anonymous GETs (**fix‑o**).

4. **Confirmation emails**  
   Deliverability and Dashboard settings (SMTP, redirect URLs) sit **outside** the repo; “no email” issues required Supabase project configuration, not only front-end changes.

5. **Reports moderation UX**  
   The **`reports`** table stores **target references only**—no reporter comment field; **stars/comments** live on **`event_feedback`**, not reports. Rich moderation previews and **restore-after-hide** needed explicit schema/RPC work (**fix‑r**).

---

## Notable decisions

| Topic | Decision |
|-------|-----------|
| **Public host data** | Tight **`hosts`** **`SELECT`** for members; **`host_public_by_slug` / `host_public_by_id`** expose **`id, slug, name, bio, logo_url`** without **`contact_email`** to anonymous callers. |
| **Realtime notifications** | **`user_notifications`** removed from **`supabase_realtime`** publication in favor of **polling** + focus refetch to avoid cross-user subscription concerns under auditor review. |
| **CSV export** | Implemented via **SECURITY DEFINER** RPC returning rows with emails; route guards restrict **export** to **Host** role (**Checker** excluded). |
| **Sign-up messaging** | Differentiate **immediate session** vs **email confirmation required** in UI to match real Supabase Auth behavior. |

---

## Closing note

This report reflects **process and architecture lessons** from building with **Lovable + Supabase**. **Live app:** [https://eventswise.lovable.app/](https://eventswise.lovable.app/) · **Repository:** [github.com/fedar-piashko-vention/community-events-hub](https://github.com/fedar-piashko-vention/community-events-hub) — also listed in [`README.md`](README.md) submission artifacts.
