REMEDIATION PROMPT — paste entire file into Lovable as one message.

Target: Gather / community-events-hub routes/login.tsx.

PROBLEM
After sign-in, redirect query param is assigned to window.location.href without validation → open redirect risk. FSP asked same-origin path allowlist.

TASK
Implement sanitizeRedirect(redirect: string | undefined): default /dashboard or /explore. Only allow relative paths: must start with exactly one leading slash, must not start with //, must not contain scheme or backslash tricks. Reject javascript: and data: if ever passed. Use router navigate with internal path when possible instead of full href.

Apply same validation to signUp emailRedirectTo when it uses user-influenced redirect (build from origin + sanitized path only).

ACCEPTANCE
/login?redirect=https://evil.com lands on safe default; /login?redirect=/e/demo works.
