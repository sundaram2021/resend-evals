# How We Built This Resend Integration: Exact Step-by-Step Blueprint & Walkthrough

This document records the exact, comprehensive step-by-step process used to build the production-ready Resend integration inside this Next.js 16 (App Router) boilerplate.

---

## Table of Contents
1. [Initial Discovery & Environment Audit](#1-initial-discovery--environment-audit)
2. [Package Management & Dependencies (pnpm)](#2-package-management--dependencies-pnpm)
3. [SDK & Deliverability Verification](#3-sdk--deliverability-verification)
4. [Architecture & Folder Structure Design](#4-architecture--folder-structure-design)
5. [Data Models & TypeScript Definitions (`lib/types.ts`)](#5-data-models--typescript-definitions-libtypests)
6. [Resend Client & Helpers (`lib/resend.ts`)](#6-resend-client--helpers-libresendts)
7. [In-Memory Webhook Store (`lib/webhook-store.ts`)](#7-in-memory-webhook-store-libwebhook-storets)
8. [React Email Component Templates (`emails/templates/`)](#8-react-email-component-templates-emailstemplates)
9. [Template Registry & Rendering Engine (`emails/index.ts`)](#9-template-registry--rendering-engine-emailsindexts)
10. [Next.js App Router API Routes (`app/api/`)](#10-nextjs-app-router-api-routes-appapi)
11. [Interactive Dashboard UI Components (`app/components/`)](#11-interactive-dashboard-ui-components-appcomponents)
12. [Master Dashboard Page (`app/page.tsx`)](#12-master-dashboard-page-apppagetsx)
13. [End-to-End Testing & Verification Scripts](#13-end-to-end-testing--verification-scripts)
14. [Production Turbopack Build & Verification](#14-production-turbopack-build--verification)

---

## 1. Initial Discovery & Environment Audit

### Step 1.1: Inspected Existing Boilerplate
We inspected the repository layout and checked `package.json` to verify the runtime environment:
- Framework: **Next.js 16.3.8** (Turbopack, App Router)
- React version: **React 19.2.8**
- Styling: **Tailwind CSS v4** (`@tailwindcss/postcss: ^4`, `tailwindcss: ^4`)
- Package manager: **pnpm@11.9.0**

### Step 1.2: Inspected `.env.local`
We confirmed the presence of credentials:
```env
RESEND_API_KEY=re_••••••••_•••••••••••••••••••••••
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### Step 1.3: Verified Resend MCP Tools & Account
Using the pre-configured Resend MCP tools:
- Called `list-domains`: Returned 0 custom domains, indicating the account is on the sandbox sending domain `onboarding@resend.dev`.
- Called `list-api-keys`: Found 2 active API keys with `full_access` permissions.

### Step 1.4: Verified Pre-Configured Resend CLI
Ran health checks using the installed `resend-cli v2.23.0`:
```bash
resend doctor -q
resend whoami -q
```
Both succeeded with `pass` on API key authentication and credential storage.

---

## 2. Package Management & Dependencies (pnpm)

### Step 2.1: PowerShell Execution Policy Resolution
On Windows PowerShell, running `pnpm` can fail with `PSSecurityException: UnauthorizedAccess` due to execution policies restricting script files (`pnpm.ps1`).  
**Fix applied:** We invoked `pnpm.cmd` directly (the Windows Command wrapper), which bypasses PowerShell script execution restrictions.

### Step 2.2: Installed Core Packages
We added the official SDK, React Email components, and icons:
```bash
pnpm.cmd add resend @react-email/components lucide-react
```
- `resend`: **v6.32.0** (meets requirement `>= 6.14.0`)
- `@react-email/components`: **v1.0.12**
- `lucide-react`: **v1.49.0**

---

## 3. SDK & Deliverability Verification

### Step 3.1: Tested Sending with `delivered@resend.dev`
We tested the Resend SDK via a minimal Node.js script using the sandbox address:
```javascript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

const { data, error } = await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
  to: 'delivered@resend.dev',
  subject: 'Integration Test',
  html: '<strong>Success!</strong> Resend integration test.',
});
```
**Key observation:** The Resend Node SDK returns `{ data, error }` instead of throwing exceptions. Checking `if (error)` explicitly is required.

### Step 3.2: Verified React Email Component Rendering
Tested whether `@react-email/components`'s `render()` function and `react: <Component />` in `resend.emails.send` work natively with React 19 and Next.js 16. Both passed seamlessly.

---

## 4. Architecture & Folder Structure Design

We designed a modular, production-grade structure separating types, API endpoints, email templates, and interactive dashboard components:

```
can-ai-agents-build-real-world-resend-integration/
├── lib/
│   ├── types.ts                    # TypeScript types for emails, templates, logs
│   ├── resend.ts                   # Resend client singleton, default sender, idempotency
│   └── webhook-store.ts            # In-memory store for webhook events and simulation
├── emails/
│   ├── index.ts                    # Template registry and HTML/text render helpers
│   └── templates/
│       ├── WelcomeEmail.tsx        # Customer onboarding template
│       ├── ReceiptEmail.tsx        # Purchase receipt/invoice template
│       ├── SecurityAlertEmail.tsx  # Security login notice template
│       └── FeedbackEmail.tsx       # CSAT rating survey template
├── app/
│   ├── api/
│   │   ├── send/route.ts           # POST: Transactional send with idempotency key
│   │   ├── emails/route.ts         # GET: Retrieve sent emails list and details
│   │   ├── preview/route.ts        # POST: Render template to HTML & plain text
│   │   ├── webhooks/resend/route.ts# POST/GET: Inbound webhook verification & event stream
│   │   └── health/route.ts         # GET: Diagnostics, domain count, latency
│   ├── components/
│   │   ├── Navbar.tsx              # Header with live health pill & tab switcher
│   │   ├── ComposerTab.tsx         # Full transactional email composer
│   │   ├── PreviewTab.tsx          # Multi-device live template renderer
│   │   ├── LogsTab.tsx             # Resend activity history & inspection modal
│   │   ├── WebhooksTab.tsx         # Inbound event monitor & simulator
│   │   ├── SettingsTab.tsx         # Diagnostics, deliverability checklist & CLI
│   │   └── Toast.tsx               # Notification feedback alerts
│   ├── layout.tsx                  # Root layout with updated metadata
│   ├── page.tsx                    # Master interactive dashboard
│   └── globals.css                 # Tailwind CSS styles
└── scripts/
    ├── test-endpoints.mjs          # End-to-end API test suite
    └── verify-integration.mjs      # Health and sending audit script
```

---

## 5. Data Models & TypeScript Definitions (`lib/types.ts`)

Created `lib/types.ts` defining:
- `TemplateId`: `'welcome' | 'receipt' | 'security' | 'feedback' | 'custom'`
- Template props interfaces: `WelcomeProps`, `ReceiptProps`, `SecurityAlertProps`, `FeedbackProps`
- `SendEmailPayload`: Structure for sending requests (`to`, `subject`, `templateId`, `props`, `html`, `text`, `replyTo`, `cc`, `bcc`, `scheduledAt`)
- `ResendEmailItem`: Resend email record structure (`id`, `to`, `from`, `subject`, `last_event`, `created_at`)
- `WebhookEventRecord`: Captured webhook event record (`id`, `type`, `created_at`, `data`, `verified`, `source`)

---

## 6. Resend Client & Helpers (`lib/resend.ts`)

Created `lib/resend.ts` with:
1. **Resend Singleton:**
   ```typescript
   export const resend = new Resend(apiKey || 're_mock_placeholder');
   ```
2. **Default Sender Address:**
   ```typescript
   export const DEFAULT_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
   ```
3. **Idempotency Key Generator:**
   Prevents double-sends or accidental duplicate billing on network retries:
   ```typescript
   export function generateIdempotencyKey(scope = 'transactional'): string {
     const timestamp = Date.now();
     const random = Math.random().toString(36).substring(2, 10);
     return `${scope}/${timestamp}-${random}`;
   }
   ```
4. **Error Formatter:** Helper function to format Resend SDK error payloads into clear messages.

---

## 7. In-Memory Webhook Store (`lib/webhook-store.ts`)

Created `lib/webhook-store.ts` to manage inbound webhook events in development:
- Global memory cache (`webhookEventsStore`) that persists across hot-reloads.
- Helper functions: `addWebhookEvent()`, `getWebhookEvents()`, `clearWebhookEvents()`.
- Supports both live Svix-verified webhooks and local dashboard-simulated triggers.

---

## 8. React Email Component Templates (`emails/templates/`)

All templates follow React Email and deliverability best practices:
- Pixel-based inline styles (no `rem` units, which email clients ignore).
- `box-border` applied to all `<Button>` elements to prevent width overflow.
- `<Preview>` element placed immediately inside `<Body>`.
- Accessible semantic markup with `<Heading>` and alt-text tags.
- Defined `PreviewProps` for development previewing.

Templates built:
1. **`WelcomeEmail.tsx`**:
   - Header with badge `✨ Welcome aboard`.
   - 3-step numbered guide (API Exploration, Domain & Webhook Setup, Real-Time Logs).
   - High-contrast Call to Action button.
   - Company footer with support email link.
2. **`ReceiptEmail.tsx`**:
   - Order confirmation header with order number and date.
   - Order metadata box (`Order Number`, `Payment Method`).
   - Itemized table with product name, quantity, and price.
   - Subtotal, estimated tax (8%), and total amount.
   - Link to download PDF invoice.
3. **`SecurityAlertEmail.tsx`**:
   - Security shield alert badge.
   - Detailed context table: login timestamp, browser/device string, IP address, approximate location.
   - Red call to action button: "Review Active Sessions & Revoke Access".
4. **`FeedbackEmail.tsx`**:
   - Customer feedback request with 1 to 5 rating buttons.
   - Deep-linked URLs for each score (`${feedbackUrl}?score=${item.score}`).
   - Button to submit a full written review.

---

## 9. Template Registry & Rendering Engine (`emails/index.ts`)

Created `emails/index.ts` containing:
- `TEMPLATES`: Map of all template definitions, human-readable names, descriptions, categories, default subject lines, and default prop values.
- `getTemplateElement(templateId, props)`: Instantiates the React component with merged props.
- `renderTemplateToHtml(templateId, props)`: Uses `@react-email/components`'s `render` to produce both:
  1. An email-client compatible HTML string.
  2. A clean plain-text fallback string (`render(element, { plainText: true })`).

---

## 10. Next.js App Router API Routes (`app/api/`)

### 1. `POST /api/send` (`app/api/send/route.ts`)
- Validates recipient email and subject line.
- Generates an idempotency key: `generateIdempotencyKey('send-' + templateId)`.
- Builds send payload: attaches either the React component or raw HTML/text.
- Calls `resend.emails.send(sendOptions, { idempotencyKey })`.
- Explicitly inspects `if (error)` and returns `{ success: false, error: error.message }` with HTTP 400.
- On success, returns `{ success: true, data: { id, to, from, subject, idempotencyKey, sentAt } }`.

### 2. `GET /api/emails` (`app/api/emails/route.ts`)
- If query parameter `?id=<email_id>` is provided, calls `resend.emails.get(emailId)`.
- Otherwise calls `resend.emails.list()`.
- Returns `{ success: true, data: [...] }`.

### 3. `POST /api/preview` (`app/api/preview/route.ts`)
- Receives `{ templateId, props }`.
- Calls `renderTemplateToHtml(templateId, props)`.
- Returns `{ success: true, html, text }`.

### 4. `POST /api/webhooks/resend` (`app/api/webhooks/resend/route.ts`)
- **Critical Resend Gotcha Solved:** Reads raw text (`await req.text()`) rather than `req.json()`, which is required for cryptographic signature verification.
- Reads `svix-id`, `svix-timestamp`, and `svix-signature` headers.
- When `RESEND_WEBHOOK_SECRET` is configured, verifies the payload using:
  ```typescript
  event = resend.webhooks.verify({
    payload: rawPayload,
    headers: { id, timestamp, signature },
    webhookSecret,
  });
  ```
- Appends the verified event to `webhookEventsStore`.
- Supports simulation via `x-simulated-event: true` header.
- `GET /api/webhooks/resend`: Returns the list of recorded webhook events.

### 5. `GET /api/health` (`app/api/health/route.ts`)
- Checks `process.env.RESEND_API_KEY`.
- Queries `resend.domains.list()` to measure live API roundtrip latency in milliseconds.
- Returns API key mask (`re_...9vXL`), sandbox status, and domain count.

---

## 11. Interactive Dashboard UI Components (`app/components/`)

Built dedicated, dark-themed dashboard components using Tailwind CSS and Lucide icons:

1. **`Navbar.tsx`**:
   - Header with Resend brand logo, Next.js 16 App Router badge.
   - Live health indicator: pulsating green status dot, roundtrip latency (e.g. `409ms`), and `Sandbox` tag.
   - Tab switcher for desktop and mobile screens.
2. **`ComposerTab.tsx`**:
   - Sender address display (`onboarding@resend.dev`).
   - Recipient input with 3 quick-select test presets:
     - `delivered@resend.dev` (Pass)
     - `bounced@resend.dev` (Hard Bounce)
     - `complained@resend.dev` (Spam Complaint)
   - Visual cards for template selection (Welcome, Receipt, Security, Feedback, Custom).
   - Dynamic variable editor tailored to each selected template.
   - Collapsible drawer for advanced delivery options (Reply-To, CC, BCC, Scheduled send).
   - "Send Email with Resend" button with loading spinner and idempotency feedback.
   - Result card showing Resend Email ID with one-click copy button.
3. **`PreviewTab.tsx`**:
   - Interactive live preview container with device frame switcher:
     - **Desktop Frame (600px standard email container)**
     - **Mobile Frame (375px phone screen)**
   - View mode switcher:
     - **Visual (rendered inside an isolated iframe)**
     - **HTML Source Code** (with one-click copy)
     - **Plain Text Fallback** (with one-click copy)
   - "Send This" button that transitions the template and variables back to the composer.
4. **`LogsTab.tsx`**:
   - Activity feed fetching sent emails from the Resend API.
   - Status filters: `All`, `Delivered`, `Sent`, `Bounced`, `Complained`.
   - Real-time search by subject, recipient, or email ID.
   - Inspection modal showing full JSON API response from `resend.emails.get()`.
5. **`WebhooksTab.tsx`**:
   - Endpoint display card with copyable `/api/webhooks/resend` URL.
   - Event simulator: trigger simulated `email.delivered`, `email.opened`, `email.clicked`, `email.bounced`, `email.complained`.
   - Live stream of captured events with type badges and JSON viewer.
6. **`SettingsTab.tsx`**:
   - Diagnostics overview: API operational status, latency, masked API key, sandbox indicator.
   - Pre-configured Resend CLI cheatsheet with copyable commands:
     - `resend doctor -q`
     - `resend emails send ...`
     - `resend webhooks listen --forward http://localhost:3000/api/webhooks/resend`
     - `resend whoami -q`
   - Deliverability checklist (DNS records, SPF, DKIM, DMARC, suppression lists).
7. **`Toast.tsx`**:
   - Floating notifications for success, error, and copy events with auto-dismiss.

---

## 12. Master Dashboard Page (`app/page.tsx`)

Replaced boilerplate `app/page.tsx` with the unified dashboard orchestrating:
- Shared state for the active tab (`composer`, `preview`, `logs`, `webhooks`, `settings`).
- Initial health check on mount via `/api/health`.
- Seamless data synchronization: clicking "Live Preview" in the Composer loads the active template and variables directly into the Preview Tab.
- Global toast notification queue.
- Updated `app/layout.tsx` metadata to:
  - Title: `Resend Email Engine — Next.js 16 Integration`
  - Description: `Production transactional email engine powered by Resend Node SDK, React Email templates, Svix webhooks, and live activity tracking.`

---

## 13. End-to-End Testing & Verification Scripts

Created two automated verification scripts:

### 1. `scripts/test-endpoints.mjs`
Automated test suite that tests all local API endpoints:
```javascript
// Tests /api/health -> confirms latency and connectivity
// Tests /api/preview -> confirms HTML length > 0
// Tests /api/send -> dispatches test email to delivered@resend.dev with idempotency key
// Tests /api/emails -> confirms list of sent emails
// Tests /api/webhooks/resend -> confirms simulated event reception and storage
```

### 2. `scripts/verify-integration.mjs`
Comprehensive audit script performing:
1. `pnpm.cmd exec tsc --noEmit` (TypeScript validation)
2. `resend doctor -q` (CLI and authentication verification)
3. `node scripts/test-endpoints.mjs` (Full API test suite)

### 3. Added `"verify"` Script to `package.json`
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "verify": "node scripts/verify-integration.mjs"
}
```

---

## 14. Production Turbopack Build & Verification

We ran the final audit:
```bash
pnpm verify
```
Result:
```
=== Running Final Resend Integration Audit ===

1. Checking TypeScript compilation...
   ✓ TypeScript types valid without errors.

2. Running Resend CLI Health Check...
   ✓ CLI Health Status: OK = true
     - [PASS] CLI Version: v2.23.0 (latest)
     - [PASS] API Key: re_...9vXL (source: secure_storage, profile: default)
     - [PASS] Credential Storage: Windows Credential Manager
     - [WARN] Domains: No domains configured (Sandbox active)

3. Testing Next.js API Endpoints...
   ✓ /api/health: Connected (Latency: 409ms)
   ✓ /api/preview: Rendered HTML (6546 bytes)
   ✓ /api/send: Dispatched successfully with idempotency key
   ✓ /api/emails: Listed sent email records
   ✓ /api/webhooks/resend: Verified & stored delivery event

=== All Resend Integration Checks Passed! ===
```

Then verified the production build with Turbopack:
```bash
pnpm build
```
Result:
```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/emails
├ ƒ /api/health
├ ƒ /api/preview
├ ƒ /api/send
└ ƒ /api/webhooks/resend
✓ Generating static pages using 7 workers (9/9) in 324ms
```
The application compiles and builds with zero errors or warnings.
