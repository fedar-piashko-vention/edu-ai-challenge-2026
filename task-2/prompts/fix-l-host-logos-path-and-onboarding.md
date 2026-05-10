REMEDIATION PROMPT — paste entire file into Lovable as one message.

Target: Gather / community-events-hub. Fixes **400/403 on POST** to `storage/v1/object/host-logos/...` with **"new row violates row-level security policy"** on `storage.objects` INSERT (or upsert first write).

---

## Root cause (review)

If **fix-j** (or equivalent) replaced `host_logos_auth_write` / `host_logos_auth_update` with policies that require:

- first path segment = **host UUID** (not user UUID), and  
- `public.is_host_member(that_host_id, auth.uid(), 'host')`,

then the app **must** upload under `"{host_id}/filename"`. The codebase still uses **`${user.id}/...`** in:

- `src/routes/_authenticated/h.$hostSlug.manage.tsx` — `uploadLogo` builds `path` with `u.user.id`
- `src/routes/_authenticated/onboarding.host.tsx` — same pattern **before** `hosts` insert

The first folder in the failing request is a UUID; if that UUID is the **user** id, the storage `WITH CHECK` fails because there is no matching membership rule for “path owner = user id,” only for **host id**.

Also ensure **fix-k** is applied: policies calling `is_host_member` need **`GRANT EXECUTE ... TO authenticated`** or evaluation fails (sometimes surfaced differently).

---

## Required changes

### 1) Manage host page — use host id in path

In `uploadLogo` (or equivalent), replace:

`const path = \`${u.user.id}/${Date.now()}-${file.name}\`;`

with:

`const path = \`${host.id}/${Date.now()}-${sanitizeForStorage(file.name)}\`;`

Use `host.id` from loaded row. Optionally sanitize file names (strip/replace spaces, limit length) so paths stay stable in policies and URLs.

### 2) Onboarding — cannot upload before host exists if policy is host-scoped

Reorder flow:

1. **Insert host** with `logo_url: null` (or omit).
2. Read returned **`id`** from insert (`select()` / `returning` single).
3. If user chose a logo file, **upload** to `"{hostId}/${timestamp}-${safeName}"`.
4. **Patch** `hosts` set `logo_url` to `getPublicUrl(path).publicUrl`.
5. Navigate to manage.

Do **not** upload to `user.id/...` on onboarding anymore.

### 3) Database sanity check (no duplicate conflicting policies)

Confirm only one pair of INSERT/UPDATE policies applies for `bucket_id = 'host-logos'` and they match the **same** path convention documented above. Remove stale permissive policies if migrations stacked incorrectly.

### 4) Existing blobs (optional)

Old logos under `user_id/...` remain public URLs but hosts may 404 uploads; migrations do not need to move objects unless you want a backfill script — document “re-upload logo once” if acceptable.

---

## Verify

- Signed-in host manager: upload succeeds; object key starts with **`{host.id}/`**.
- Second authenticated user (not a member of that host): upload to **`{victimHostId}/...`** still **fails** (policy denied).
- Onboarding: create host with logo end-to-end works without storage error.
