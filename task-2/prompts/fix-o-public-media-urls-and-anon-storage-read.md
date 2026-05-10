REMEDIATION PROMPT — paste entire file into Lovable as one message.

Target: Gather / community-events-hub. Covers **(1)** **`cover_image_url` / `logo_url`** null on Explore and event detail, demo seeds, persisting uploads; **(2)** **anonymous visitors** not seeing images when URLs exist — **`<img>`** hits Storage **without JWT**, so **`storage.objects`** must allow **`anon` `SELECT`** on public buckets. Former **fix-o** + **fix-p** scope in one paste.

---

## PART A — Null URLs in API / grey placeholders

### Root causes

**A1) Demo seed omits URLs**

In **`20260509075412_*.sql`**, **`hosts`** insert omits **`logo_url`** and **`events`** inserts omit **`cover_image_url`** → API returns **null** until backfilled or uploads persist.

**A2) Uploads never landed in Postgres**

If Storage **write** RLS failed (**fix-l** / **fix-m**), **`logo_url` / `cover_image_url`** stay null.

**A3) Save paths**

Confirm **event editor** includes **`cover_image_url`** on Save/Publish; **host** onboarding/manage updates **`logo_url`** after upload.

### Fix (Part A)

1. **Migration (recommended):** **`UPDATE`** demo **`hosts`** (`gather-demo`) and demo **`events`** (`demo-launch-night`, `demo-spring-meetup`) with stable **HTTPS** **`logo_url` / `cover_image_url`** (e.g. **`public/`** assets or documented CDN URLs). Document in **`SECURITY-NOTES.md`**.

2. **Optional UX:** Placeholders when **`cover_image_url`** is null (Explore already uses muted **`aspect-video`** block).

### Verify (Part A)

- Anon **`GET /events`** returns **non-null** **`cover_image_url`** for demo rows after backfill (where intended).
- **`rpc('host_public_by_id', { _id })`** returns **non-null** **`logo_url`** for **`gather-demo`** after backfill.

### Constraint

Do not add **`hosts(...)`** embeds on Explore for anon without anon-safe **`hosts`** access or a **SECURITY DEFINER** RPC — **`hosts` RLS** is member-only after hardening.

---

## PART B — URLs present but images missing for anonymous visitors (Storage `SELECT`)

### Root cause

1. **`<img src>` does not send the Supabase session.** Requests to `…supabase.co/storage/v1/object/public/…` use the **`anon`** role for **`storage.objects`** RLS.

2. **`20260508150056_*.sql`** **dropped** **`host_logos_public_read`** and **`event_covers_public_read`**. Write policies were tightened later; **broad `SELECT` for public buckets** was not restored.

3. **Anonymous GET** to stored files → **403** → broken images on Explore / **`/e/:slug`** even when **`cover_image_url` / `logo_url`** in Postgres are correct. **Edit/manage** can still “look OK” (preview/cache); public pages always use **anon** image fetches.

### Fix (Part B) — database

Restore **public read** on **`storage.objects`** for both **public** buckets (same intent as pre-**`50056`**):

```sql
DROP POLICY IF EXISTS host_logos_public_read ON storage.objects;
CREATE POLICY host_logos_public_read ON storage.objects
  FOR SELECT
  USING (bucket_id = 'host-logos');

DROP POLICY IF EXISTS event_covers_public_read ON storage.objects;
CREATE POLICY event_covers_public_read ON storage.objects
  FOR SELECT
  USING (bucket_id = 'event-covers');
```

Keep existing **INSERT/UPDATE** policies that restrict **writes** to host managers (**fix-j** / **fix-m** versions).

**Security:** Public buckets are **world-readable by URL**; **writes** remain restricted. For truly private assets later, use a **private** bucket + signed URLs.

### Verify (Part B)

- **Logged out**, DevTools → Network: Storage image URLs **200** on **`/explore`** and **`/e/{slug}`**.
- Another user still **cannot upload** into another host’s object prefix (write policies unchanged).

---

## Relation to **fix-m**

**fix-m** also covers **`split_part`** upload policies + restoring **`SELECT`**. Use **fix-o** when you want **one narrative** for **demo URLs + anon image reads**; use **fix-m** alone if you are still fixing **upload** path / policy SQL.

---

## Deliverables

- Migration(s): optional seed **`UPDATE`** for demo media URLs + **`SELECT`** policies above (idempotent drops).
- **`SECURITY-NOTES.md`**: demo placeholders + public bucket anon read + uploads gated by write policies.
