REMEDIATION PROMPT — paste entire file into Lovable as one message.

Target: Gather / community-events-hub routes/_authenticated/my-events.tsx.

PROBLEM
FSP requires My Events filters including filter by Host. Current UI has role filter and title search but no host/org selector.

TASK
Add a Select dropdown: “All hosts” plus one option per distinct host from memberships (host.name). When a host is selected, filter aggregated events to events where host_id matches. Keep upcoming/past tabs, role filter, and text search working together.

ACCEPTANCE
User with two host memberships can isolate events per host via dropdown.
