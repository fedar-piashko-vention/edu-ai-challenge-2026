REMEDIATION PROMPT — paste entire file into Lovable as one message.

Target: Gather / community-events-hub routes/h.$slug.tsx public host page.

PROBLEM
Listed events render as cards without links to event detail pages. Browsing from host profile should open /e/$slug per event.

TASK
Wrap each event card title or whole card in Link to="/e/$slug" params={{ slug: event.slug }}. Preserve Ended badge and styling. Accessible focus/hover unchanged.

ACCEPTANCE
Clicking any listed event navigates to the correct public event page for anonymous users.
