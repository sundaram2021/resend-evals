# Resend Email Integration for Next.js 16 (App Router)

A production-ready, full-stack transactional email platform built inside Next.js 16 (Turbopack) using the official Resend Node SDK, React Email templates, Svix cryptographic webhook verification, and CLI tooling.

---

## 🌟 Key Features

1. **Transactional Email Composer**:
   - Dispatches single and batch emails with the official `resend` Node.js SDK.
   - Automatic generation of **Idempotency Keys** (`send-<template>/<timestamp>-<random>`) to prevent duplicate sends during network retries.
   - Quick-select simulation addresses:
     - `delivered@resend.dev` (Simulates 100% successful delivery)
     - `bounced@resend.dev` (Simulates hard bounce)
     - `complained@resend.dev` (Simulates spam complaint)

2. **React Email Component Templates**:
   - **Welcome / Onboarding**: Multi-step onboarding guide, CTA button, and brand header.
   - **Purchase Receipt**: Detailed itemized invoice with subtotal, tax calculation, and order metadata.
   - **Security Login Alert**: Urgent new sign-in notification with IP, timestamp, device, and revoke button.
   - **Customer Feedback (CSAT)**: Interactive 1–5 rating buttons with feedback link.
   - **Custom HTML**: Direct raw HTML or accessible plain-text markup.

3. **Live Template Preview & Inspector**:
   - Real-time rendering via `@react-email/components`'s `render` function.
   - Multi-device preview: **Desktop (600px)** and **Mobile (375px)** frames.
   - Mode toggles: **Visual Preview (Iframe)**, **HTML Source Code**, and **Accessible Plain Text**.

4. **Real-Time Activity Logs & Inspection**:
   - Directly calls `resend.emails.list()` and `resend.emails.get(id)` to retrieve delivery statuses (`delivered`, `sent`, `bounced`, `queued`, `complained`).
   - Detailed modal inspector displaying exact Resend API response payloads, timestamps, and message IDs.

5. **Inbound Webhook Verification**:
   - Endpoint: `/api/webhooks/resend`
   - Uses raw request text (`await req.text()`) and `resend.webhooks.verify()` with Svix timestamp and signature headers.
   - Built-in event simulator to test delivery lifecycle triggers instantly in development.

6. **Diagnostics & CLI Tools**:
   - Real-time API latency and authentication check (`/api/health`).
   - Seamless integration with the pre-configured `resend-cli v2.23.0`.

---

## 🚀 Quick Start

### 1. Requirements & Package Management
Use **pnpm** as requested:
```bash
pnpm install
```

### 2. Environment Configuration
Ensure `.env.local` contains your Resend API credentials:
```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
# Optional: webhook signing secret from Resend dashboard
RESEND_WEBHOOK_SECRET=whsec_your_secret_here
```

### 3. Start the Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Architecture & File Structure

```
├── app/
│   ├── api/
│   │   ├── send/route.ts            # POST: sends email via Resend SDK with idempotency key
│   │   ├── emails/route.ts          # GET: lists sent emails or inspects email by ID
│   │   ├── preview/route.ts         # POST: renders React Email template to HTML & text
│   │   ├── webhooks/resend/route.ts # POST/GET: Svix-verified webhook receiver & store
│   │   └── health/route.ts          # GET: diagnostics, domain count, latency
│   ├── components/
│   │   ├── Navbar.tsx               # Header with live health pill & tab switcher
│   │   ├── ComposerTab.tsx          # Full transactional email composer
│   │   ├── PreviewTab.tsx           # Multi-device live template renderer
│   │   ├── LogsTab.tsx              # Resend activity history & inspection modal
│   │   ├── WebhooksTab.tsx          # Inbound event monitor & simulator
│   │   ├── SettingsTab.tsx          # Diagnostics, deliverability checklist & CLI
│   │   └── Toast.tsx                # Notification feedback alerts
│   ├── layout.tsx
│   ├── page.tsx                     # Main interactive dashboard
│   └── globals.css
├── emails/
│   ├── index.ts                     # Template registry and rendering helpers
│   └── templates/
│       ├── WelcomeEmail.tsx         # Modern onboarding email
│       ├── ReceiptEmail.tsx         # Itemized purchase receipt
│       ├── SecurityAlertEmail.tsx   # Security notice with IP and device
│       └── FeedbackEmail.tsx        # CSAT survey email
├── lib/
│   ├── resend.ts                    # Resend singleton, sender config, idempotency
│   ├── types.ts                     # TypeScript definitions
│   └── webhook-store.ts             # In-memory webhook event store
└── scripts/
    ├── test-endpoints.mjs           # E2E API endpoint test suite
    └── verify-integration.mjs       # Quick health and sending verification
```

---

## 🛠️ Resend CLI Commands

Your system has `resend-cli v2.23.0` pre-configured. You can run:

```bash
# Check CLI and environment status
resend doctor -q

# Send a test email from the terminal
resend emails send --from onboarding@resend.dev --to delivered@resend.dev --subject "CLI Test" --text "Sent via CLI"

# Forward production webhooks to local dev server
resend webhooks listen --forward http://localhost:3000/api/webhooks/resend

# Inspect active profile and permissions
resend whoami -q
```

---

## 🛡️ Deliverability Best Practices

- **Sandbox Restriction**: The default sender `onboarding@resend.dev` is a sandbox domain. It can only deliver to your Resend account email and `delivered@resend.dev`.
- **Domain Verification**: Add a custom domain in the Resend dashboard and verify its **DKIM**, **SPF**, and **DMARC** records to deliver to arbitrary recipients at scale.
- **Idempotency Protection**: Never retry email sends without an idempotency key. Format: `<event-type>/<entity-id>`.
