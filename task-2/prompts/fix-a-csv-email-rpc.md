REMEDIATION PROMPT — paste entire file into Lovable as one message.

Target codebase: Gather / community-events-hub (TanStack Start + Supabase).

PROBLEM
exportCsv in _authenticated/h.$hostSlug.manage.tsx fills the CSV email column with empty strings because attendee email is not exposed to the client. FSP requires CSV columns exactly: name, email, RSVP status, check-in time (UTF-8 BOM retained).

TASK
Implement a Postgres SECURITY DEFINER RPC only callable by users who are host role members for the event’s host_org, e.g. export_event_attendees_rows(_event_id uuid) returning setof record or jsonb rows: full_name or name, email, rsvp_status, check_in_time (ISO text or blank).

Inside the function: validate is_host_member(events.host_id, auth.uid(), 'host'); join event_rsvps → auth.users on user id for email; outer join tickets + check_ins for check-in timestamp. Grant execute to authenticated only.

Replace client-side attendee fetch in Manage “Export CSV” with this RPC result and feed existing toCsv() helper with headers ["name","email","RSVP status","check-in time"]. Remove reliance on exporting without email.

ACCEPTANCE
Host users get non-empty emails for normal accounts; checker cannot call RPC (forbidden); CSV opens in Excel/Google Sheets with BOM.
