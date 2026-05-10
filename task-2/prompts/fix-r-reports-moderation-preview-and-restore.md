REMEDIATION PROMPT — paste entire file into Lovable as one message.

Target: Gather / community-events-hub — **`src/routes/_authenticated/h.$hostSlug.moderation.tsx`** plus **`public.resolve_report`** (and optional **`reports`** column) in Supabase migrations.

---

## Problems

1. **Report rows show almost no context** — only `target_type` and a truncated UUID. Hosts cannot see **what** was reported (event title, gallery thumbnail, etc.).

2. **After “Hide content” there is no “Unhide / Restore”** — `resolve_report(..., 'hide')` sets `reports.status = 'hidden'` and mutates the target (`gallery_items` → hidden, or `events` → `draft`). The UI only renders action buttons when `report.status === 'open'`, so **`hidden` reports show no actions** and content stays penalized with no reversal path.

3. **UX clarity** — The word **`open`** on the badge looks like a button; keep it as **status** but label it clearly (e.g. **Status: Open** / **Resolved — hidden**).

---

## Part A — Show report context (minimal schema change)

The **`reports`** table has **`target_type`**, **`target_id`**, **`host_id`**, **`reporter_user_id`**, **`status`**, **`created_at`** — no free-text “reason”. **Derive context by joining:**

| `target_type` | Join / fetch |
|---------------|----------------|
| **`event`** | `events` where `id = target_id` → show **title**, **slug**, **current status** / visibility; link **`/e/{slug}`**. |
| **`gallery_item`** | `gallery_items` where `id = target_id` → **thumbnail** (`image_url`), **`event_id`** → join **event title + slug**; link to event page. |

Implement either:

- **Client-side**: after `select` reports for `host_id`, batch-fetch related `events` / `gallery_items` by IDs, or  
- **RPC** `reports_for_host(host_id uuid)` **SECURITY DEFINER** returning rows with embedded preview fields (cleaner for one round-trip).

Respect **RLS**: host-side select already allowed via **`reports_select_host`**; joining **`events`** / **`gallery_items`** must succeed for **`host` role** (existing policies).

---

## Part B — Restore / “Unhide” after hide

Today **`resolve_report`** supports **`hide`** and **`dismiss`** only (`20260509075412_*.sql`). **`hide`** does:

- **`gallery_item`**: `gallery_items.status = 'hidden'`
- **`event`**: `events.status = 'draft'`
- then **`reports.status = 'hidden'`**

To **reverse** this safely you must know **previous** event (and optionally gallery) state. **Recommended approach:**

1. **Migration** — add nullable **`reports.resolution_snapshot jsonb`** (or similar name). In **`resolve_report` `hide` branch**, **before** mutating the target, **read** the current row(s) and **store** in `resolution_snapshot`, e.g.  
   - event: `{ "event": { "status", "visibility" } }`  
   - gallery: `{ "gallery": { "status" } }`

2. **Extend** **`resolve_report`** (or add **`restore_report`**) with a new action, e.g. **`restore`**, allowed only when **`reports.status = 'hidden'`** and caller is **host** (same authz as today):

   - If snapshot exists, **apply inverse** (gallery status back to previous, e.g. `pending` or `approved` per product; event **status/visibility** restored from snapshot).  
   - Set **`reports.status`** to **`open`** (or **`dismissed`** if you prefer “closed but addressed” — pick one and document).

3. If you **refuse** schema change: **partial** restore only for **gallery** (reset to `pending`) and for **events** show a **inline notice + link to event editor** (“Republish from Manage”) without auto-`published` — **less ideal**, document the trade-off.

4. **GRANT EXECUTE** on any new/changed function to **`authenticated`** as needed; regenerate **`src/integrations/supabase/types.ts`**.

---

## Part C — Moderation UI updates

1. For each report card, render **preview** (title, image, links) as in Part A.

2. **Actions by status**

   - **`open`**: keep **Hide content** + **Dismiss** (existing RPC).

   - **`hidden`** (after hide): show **Restore content** (or **Unhide**) calling the new **`restore`** / **`restore_report`** path. Optionally **Dismiss** if you still want to close without changing targets.

   - **`dismissed`**: read-only or only “Reopen” — product choice; **minimal scope** = no new actions.

3. Ensure **loading / error toasts** on all RPCs.

4. **Accessibility** — `CardTitle` should not be only raw UUID; use **human-readable** primary line + optional mono **ID** in secondary text.

---

## Verify

- Create test **event** and **gallery** reports; moderation shows **titles / thumbnails** and **working links**.

- **Hide** then **Restore** returns gallery/event to a sensible prior/public state (per snapshot logic).

- Non-host users cannot restore via API.

---

## Deliverables

- Migration(s) for **`resolution_snapshot`** + updated **`resolve_report`** / **`restore`** RPC.  
- Updated **`moderation.tsx`**.  
- Short **`SECURITY-NOTES.md`** bullet on snapshot behavior.
