REMEDIATION PROMPT — paste entire file into Lovable as one message.

Target: Gather / community-events-hub (Supabase + TanStack Start). Fix four independent findings without regressing Explore, RSVP, host/checker flows, or CSV export.

---

ISSUE 1 — hosts.contact_email exposed via permissive SELECT

Problem: Policy effectively allows unauthenticated SELECT on entire hosts rows including contact_email.

Approach (pick one coherent implementation; prefer RPC + tight RLS):

A) Drop blanket hosts SELECT for anon/public on the physical table. Replace with:
- POLICY hosts_select_member_full ON public.hosts FOR SELECT TO authenticated USING (public.is_host_member(id, auth.uid()));
- PLUS POLICY hosts_select_owner_if_needed ON public.hosts FOR SELECT TO authenticated USING (owner_user_id = auth.uid()) if onboarding flows require it before membership row exists.

B) Public surfaces MUST NOT query hosts directly for anon users. Add SECURITY DEFINER RPC stable:

public.host_public_by_slug(_slug text)
RETURNS TABLE(id uuid, slug text, name text, bio text, logo_url text)
LANGUAGE sql SET search_path = public
AS $$
  SELECT h.id, h.slug, h.name, h.bio, h.logo_url
  FROM public.hosts h WHERE h.slug = _slug LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.host_public_by_slug(text) TO anon, authenticated;

Update loaders/pages that render public host profile for logged-out users: routes/h.$slug.tsx loader/useEffect, explore joins if any, anywhere anon reads hosts — switch to rpc('host_public_by_slug',{slug}) or equivalent.

Authenticated manage/edit flows that need contact_email keep using .from('hosts') with policies above.

Verify: anon cannot SELECT from hosts via REST (403 or empty); contact_email only appears for host members.

---

ISSUE 2 — storage bucket event-covers INSERT/UPDATE too permissive

Problem: Policies only require authenticated role; any user can write arbitrary paths.

Fix:
1) Standardize object path convention including immutable ownership key, e.g. "{event_id}/{filename}" (UUID folder segment equals events.id). Update EventEditor / cover upload code to upload under that prefix using the event id being edited (create flow: save draft first to obtain id, then upload — or use temporary draft id pattern you document).

2) REPLACE insert/update policies with checks that:
- bucket_id = 'event-covers'
- (storage.foldername(name))[1]::uuid matches an event id AND public.is_host_member((SELECT host_id FROM events WHERE id = (storage.foldername(name))[1]::uuid), auth.uid(), 'host'::host_role)

Adjust folder parsing if you use more path segments; use split_part if needed.

3) SELECT public read can remain bucket-wide read if bucket is public CDN; optional tighten later.

---

ISSUE 3 — storage bucket host-logos INSERT/UPDATE too permissive

Problem: Same as covers — only authenticated check.

Fix:
1) Standardize paths as "{host_id}/{filename}" where host_id is hosts.id UUID.

2) REPLACE policies so insert/update require:
- bucket_id = 'host-logos'
- first path segment parses to uuid = host_id AND public.is_host_member(host_id, auth.uid(), 'host'::host_role)

3) Update Host manage logo upload to use `${host.id}/...` instead of `${user.id}/...`.

---

ISSUE 4 — user_notifications in supabase_realtime / subscription scope

Problem: Table added to publication supabase_realtime; auditors worry cross-user channel subscription despite client filter.

Preferred secure fix (minimal surface):
1) Remove table from realtime publication for defense in depth:
   ALTER PUBLICATION supabase_realtime DROP TABLE public.user_notifications;

2) Update notifications-bell.tsx (and any subscriber): remove channel.subscribe postgres_changes on user_notifications; replace with lightweight polling (e.g. refetch every 15–30s when dropdown open) OR refetch on window focus + after RSVP actions; keep existing .from('user_notifications').select() which already respects RLS.

Alternative if you insist on realtime: implement Supabase Realtime Authorization for your project version (private channel / authorize callback) per current docs — only if you can verify policies block other users; document in comment. Do NOT rely on client-side filter strings alone as the sole control.

---

DELIVERABLES
- New SQL migration(s) under supabase/migrations applying policies + publication change + RPC + storage policy replacements.
- TS/React updates for host public fetch, storage paths, notifications UX.
- Short SECURITY-NOTES.md bullet list of what changed (optional).

ACCEPTANCE CHECKLIST
- Logged-out Supabase REST: cannot read hosts.contact_email (verify with curl or SQL as anon role).
- Random authenticated user cannot INSERT into event-covers/host-logos paths for events/hosts they do not host-manage (verify with second test account).
- Notifications still arrive for end users via polling or authorized realtime; no cross-user leaks in manual test with two browsers.
- Build passes; existing flows (publish, RSVP, manage, CSV RPC) still work.
