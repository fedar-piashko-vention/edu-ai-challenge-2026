REMEDIATION PROMPT — paste entire file into Lovable as one message.

Target: Gather / community-events-hub (Supabase). Fixes **403 on POST /rest/v1/hosts** with Postgres **42501** and message **permission denied for function is_host_member**.

---

## Root cause (review)

`public.is_host_member(...)` is referenced throughout **RLS policies** (hosts, host_members, events, storage policies, etc.). In PostgreSQL, policy expressions run with the **privileges of the role executing the query** (the Supabase **authenticated** JWT role for logged-in API calls), not “as the table owner.” That role must therefore have **EXECUTE** on every function invoked inside policies.

A migration likely contains **`REVOKE EXECUTE ... FROM authenticated`** on `is_host_member`, sometimes with a mistaken comment that RLS does not need grants. That revoke breaks:

- Any **SELECT** policy using `is_host_member` — including PostgREST **`POST ...?select=id`**, which inserts then **re-selects** the row to return `id`.
- Host creation appears as “cannot create event” because the client creates (or upserts) a **host** first and the returning SELECT fails.

This is **not** fixed by changing app code alone unless you remove all `is_host_member` references from policies (undesirable).

---

## Fix (database)

1. Add a **new migration** (do not edit squashed history in place if already applied remotely) that **grants execute** back to roles that must satisfy RLS:

```sql
-- Allow authenticated clients to evaluate RLS policies that call this helper.
GRANT EXECUTE ON FUNCTION public.is_host_member(uuid, uuid, public.host_role) TO authenticated;
```

2. If any policy for role **`anon`** references `is_host_member` (unusual if public reads use SECURITY DEFINER RPCs only), either:
   - also `GRANT EXECUTE ... TO anon`, **or**
   - prefer removing `is_host_member` from anon-facing policies and keep anon on RPC/views only.

3. **Remove or replace** any migration text that says RLS “does not need” EXECUTE on helpers — that statement is incorrect for PostgreSQL RLS.

4. **Do not** broadly publish `is_host_member` as a public RPC unless product requires it; EXECUTE for **`authenticated`** is enough for normal logged-in CRUD.

---

## Verify

- Logged-in user: `POST /rest/v1/hosts` with body matching `hosts_insert_owner` rule (`owner_user_id` = JWT sub) and `Prefer: return=representation` or `?select=id` returns **201** and an **id**, not 403.
- Smoke-test flows that touch events, invites, storage uploads — any policy using `is_host_member` should work without 42501.

---

## Optional note for fix-J alignment

If **fix-j** tightened `hosts` SELECT to members-only, the insert path still works **after** `handle_new_host` adds `host_members`, but the SELECT leg **requires** EXECUTE on `is_host_member` for **`authenticated`**. This grant is required for that design to function.
