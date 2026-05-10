REMEDIATION PROMPT — paste entire file into Lovable as one message.

Target: Gather / community-events-hub — **`src/routes/login.tsx`** (or equivalent login route).

---

## Problem

After **Create account**, the UI always shows **“Check your email to confirm your account”** even when Supabase is configured with **no email confirmation** (user gets an **immediate session**). That message is **misleading** and users expect to land in the app like after sign-in.

---

## Intended behavior

Use the **`signUp` response** from `supabase.auth.signUp`:

| Result | Meaning | UI |
|--------|---------|-----|
| **`data.session` present** | User is signed in immediately (e.g. confirm email disabled, or project allows instant login). | **Do not** show the “check your email” toast. Show a short success (e.g. “Signed in” or “Welcome”) and **redirect** the same way as **Sign in**: `window.location.assign(safePath)` where **`safePath`** comes from existing **`sanitizeRedirect(search.redirect)`** (keep **same-origin** rules as today). |
| **`data.session` absent** (no error) | Email confirmation required; user must verify inbox before password sign-in works. | Show **“Check your email to confirm your account”** (or similar). Optionally switch the **Tabs** UI to the **Sign in** tab so they know where to sign in after confirming. |

---

## Implementation notes

1. Destructure **`const { data, error } = await supabase.auth.signUp(...)`** — keep existing **`options`** (`emailRedirectTo`, **`data: { full_name }`**, etc.).

2. On **`error`**, keep current **`toast.error`**.

3. After success, **branch on `data.session`**:
   - If session: **`toast.success`** + **`window.location.assign(safePath)`** (mirror **`signIn`** success path).
   - Else: email toast + **`setTab("signin")`** if you use **controlled** tabs.

4. Use **controlled** `<Tabs value={tab} onValueChange={...}>` so you can programmatically select **Sign in** when confirmation is pending.

5. **Do not** weaken auth settings in code — this is **pure UX** branching on the API response.

---

## Verify

- **Confirm email OFF** (dev/staging): register → **immediate redirect** to **`safePath`** (default **`/dashboard`** when no `?redirect=`), **no** misleading email toast.
- **Confirm email ON**: register → **email** toast (or your copy) + **Sign in** tab selected; no redirect until they confirm and sign in.

---

## Deliverables

- Updated **`login.tsx`** (or route file) only; no unrelated refactors.
