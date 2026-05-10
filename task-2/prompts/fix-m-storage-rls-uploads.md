REMEDIATION PROMPT — paste entire file into Lovable as one message.

Target: Gather / community-events-hub (Supabase Storage). You still see **`403` / `new row violates row-level security policy`** on `POST /storage/v1/object/host-logos/...` or `event-covers/...` after fix-j style policies + client path fixes.

---

## What we verified in repo (post-pull)

- Policies in `20260509095133_*.sql` tie uploads to `(storage.foldername(name))[1]` + `is_host_member(..., 'host')` (logos) or `events.id` + host membership (covers).
- Client uses `${host.id}/...` (manage + onboarding) and `${eventId}/...` after draft insert (event editor). Paths look correct.
- `20260508150056_*.sql` **dropped** `host_logos_public_read` and `event_covers_public_read`. There is **no** `SELECT` policy on `storage.objects` for those buckets afterward (only `event-gallery` gets a read policy in a later migration). Some Storage flows still expect readable metadata for public buckets.
- `20260509101856_*.sql` grants **`EXECUTE` on `is_host_member`** to `authenticated` — good; if this migration never ran remotely, you would usually see **function permission** errors, not pure RLS — but apply order must be correct on Supabase.

---

## Likely causes to eliminate (in order)

### A) Path parsing in RLS: prefer `split_part` over `foldername()[1]`

Supabase docs use `storage.foldername(name)[1]`, but production differences / edge paths occasionally mis-parse. Replace checks with an explicit first segment:

- First folder segment: `split_part(name, '/', 1)` (reject empty).
- Host logos: `split_part(name, '/', 1)::uuid` must equal a host the user hosts.
- Event covers: `split_part(name, '/', 1)::uuid` must equal an `events.id` row where `is_host_member(events.host_id, auth.uid(), 'host')`.

Keep **`name`** as the storage object key only (no bucket prefix in `name`).

### B) Restore public SELECT policies for public CDN buckets

Re-create **permissive SELECT** on `storage.objects` for anon + authenticated for buckets `host-logos` and `event-covers` (same intent as the original `*_public_read` policies removed in `50056`). Example pattern:

```sql
CREATE POLICY host_logos_public_read ON storage.objects
  FOR SELECT USING (bucket_id = 'host-logos');

CREATE POLICY event_covers_public_read ON storage.objects
  FOR SELECT USING (bucket_id = 'event-covers');
```

(Tighten later if you need signed URLs only — but match current “public bucket” product.)

### C) Membership row must exist before upload

Upload checks **`is_host_member(host_id, ..., 'host')`**. Confirm on Supabase:

- Migration **`20260509105418_*.sql`** ran: `on_host_created` trigger + backfill `host_members` for owners.
- For a failing user, SQL check (service role or SQL editor): `select * from host_members where user_id = '<auth uid>' and host_id = '<first path uuid>';` — expect **`role = host`**.

### D) Client path hygiene

In upload helpers, **sanitize `file.name`**: remove `/`, `\`, leading `.`, collapse whitespace; optional `encodeURIComponent`-safe slug — avoid extra `/` segments so `split_part(..., '/', 1)` stays the pure UUID folder.

### E) Optional: SECURITY DEFINER helpers for policies (clearest semantics)

Add **`public.storage_can_upload_host_logo(_name text)`** and **`public.storage_can_upload_event_cover(_name text)`**, both **`STABLE SECURITY DEFINER`**, `SET search_path = public`, implementing the same rules using `split_part` + `is_host_member` / `events` lookup. Policies become **`WITH CHECK (... storage_can_upload_host_logo(name))`** so logic is one place and easier to test with `select storage_can_upload_host_logo('uuid/file.png');` as the user.

---

## Acceptance checks

1. As host owner: upload logo and cover on a fresh host/event — **201** from Storage API.  
2. As second authenticated user (not member): upload to **`{victimHostOrEventId}/file`** — must still **fail**.  
3. Anon can **GET** public URLs for those buckets (browser / curl) if buckets remain public.  
4. No regression on `GRANT EXECUTE` for `is_host_member` / related helpers.

---

## Deliverables

- One new migration: **replace** storage INSERT/UPDATE policy expressions (or swap to helper functions), **add** SELECT policies for both buckets, keep buckets public as today.  
- Optional small TS change: filename sanitization on upload paths.  
- Update `SECURITY-NOTES.md` one bullet on SELECT restoration + `split_part`.
