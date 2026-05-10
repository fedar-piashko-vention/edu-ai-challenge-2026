REMEDIATION PROMPT — paste entire file into Lovable as one message.

Target: Gather / community-events-hub (Supabase). **Anonymous** users get **`401` / `42501` `permission denied for function is_host_member`** when calling **`GET /rest/v1/events?...`** (Explore / search published public events).

---

## Root cause (review)

1. **`events_select_members`** is defined as `FOR SELECT` **without** `TO …`, so it applies to **all roles**, including **`anon`**.

2. Its `USING` clause calls **`public.is_host_member(host_id, auth.uid())`**.

3. Migration **`20260508150056_*.sql`** runs **`REVOKE EXECUTE ON FUNCTION public.is_host_member(...)` FROM `public`, `anon`** (and related).

4. For **permissive** RLS, multiple `SELECT` policies are **OR**’d. PostgreSQL still **evaluates** policy expressions that apply to the current role. When **`anon`** runs the query, evaluation touches **`events_select_members`**, which **invokes** `is_host_member` → **`anon` lacks EXECUTE** → **`42501`**, even when **`events_select_published_public`** would allow the row.

**Do not “fix” this by granting `EXECUTE` on `is_host_member` to `anon`:** clients could then call the RPC with arbitrary `(host_id, user_id)` tuples and **probe membership** (information leak). **`SECURITY DEFINER`** does not remove that concern.

---

## Fix (database)

Add a **new migration** that **scopes role-specific policies** so **`anon` never evaluates** policies that call membership helpers.

### Minimum change (events table)

1. **`DROP POLICY IF EXISTS events_select_members ON public.events;`**

2. Recreate **only for authenticated**:

```sql
CREATE POLICY events_select_members ON public.events
  FOR SELECT
  TO authenticated
  USING (public.is_host_member(host_id, auth.uid()));
```

3. Ensure **anonymous Explore** remains allowed via existing policies, explicitly if needed:

```sql
-- If not already clearly scoped, prefer explicit roles:
-- events_select_published_public → TO anon, authenticated (or TO public)
-- events_select_unlisted_anyone → keep product intent (often TO public)
```

Review **`events_select_published_public`** and **`events_select_unlisted_anyone`**: if they currently have **no** `TO` clause, they already apply to everyone including anon — that is fine **as long as they do not call** `is_host_member`. Optionally add **`TO public`** for clarity (same behavior).

### Repo-wide audit (same failure mode)

Search migrations for **`CREATE POLICY`** on **`SELECT`** (and other commands) whose expression references **`is_host_member`** or **`is_event_member`**. Any policy meant **only for logged-in users** must include **`TO authenticated`** (or **`TO authenticated` + specific roles**), **not** bare `FOR SELECT` for all roles.

Typical candidates: **`host_members`**, **`hosts`** (if any policy still applies to anon and calls helpers), **`reports`**, **`gallery_items`**, etc. — align **`TO`** with intent.

---

## Verify

- **Logged out** (no `Authorization` header): `GET /rest/v1/events?select=id,slug,title&status=eq.published&visibility=eq.public&limit=5` → **200** with rows (not 401).
- **Logged in** host: still sees member-only event rows per **`events_select_members`**.
- **`authenticated`** still has **`GRANT EXECUTE`** on **`is_host_member`** (keep **`20260509101856_*.sql`** or equivalent).

---

## Deliverables

- One migration applying policy **`TO`** fixes + short note in **`SECURITY-NOTES.md`** (why anon broke after revoke + member policy scope).
