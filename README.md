# 🧠 Internal AI Tools Dashboard

A secure internal dashboard built with **Next.js App Router (v16)** for managing and launching internal AI tools.  
Features include:

*   Password‑protected **Settings** area
*   Add / Edit / Delete tool entries
*   Beautiful **Home** page with card grid
*   Header‑less admin area
*   Optional persistence with **Vercel KV**
*   Fully server‑rendered, safe, and cleanly structured with **Route Groups**

***

## 🚀 Getting Started (Development)

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Then open:

➡️ **<http://localhost:3000>**

***

## 🔐 Authentication (Admin Mode)

The admin section lives at:

    /internalaitools/settings

The first time you visit, you will be redirected to:

    /admin/login

Set your admin password in your **`.env.local`**:

```env
ADMIN_PASSWORD=your-secret-here
```

After logging in, you can:

✔ Add Tools  
✔ Edit Tools  
✔ Delete Tools  
✔ Logout (clears admin session cookie)

Admin auth uses an **HttpOnly cookie**:

    admin=1

***

## 📁 Project Structure

Your app uses **Next.js Route Groups**:

    app/
     ├─ layout.tsx                     # Root layout, wraps entire app (html/body required)
     │
     ├─ (site)/                        # Public area (header enabled)
     │    ├─ layout.tsx                # Includes Header + container
     │    └─ page.tsx                  # Home page (“/”)
     │
     ├─ (site)/admin/login/page.tsx    # Login page
     │
     ├─ (settings)/                    # Admin area (no header)
     │    └─ internalaitools/settings/
     │         ├─ layout.tsx           # Headerless layout
     │         └─ page.tsx             # Settings dashboard
     │
     └─ api/
          ├─ auth/login/route.ts       # Login (sets admin cookie)
          ├─ auth/logout/route.ts      # Logout (clears cookie)
          ├─ apps/route.ts             # GET + POST Tools
          └─ apps/[id]/route.ts        # PUT + DELETE Tools

***

## 🗃 Storage (Local + Optional Vercel KV)

By default (local development), the app uses an **in‑memory global store** so data persists across HMR but resets when the server restarts.

To enable **persistent cloud storage**, set these in your Vercel project:

```env
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

When these variables exist, the app automatically uses **Vercel KV** (no code changes required).

***

## 🖥 Home Page

`/` shows all published internal tools:

*   Tool name
*   README link
*   App link
*   Thumbnail
*   Styled card grid
*   Smooth hover animations, modern dark UI

All tools come from the shared data store (`listApps()`).

***

## 🔧 Settings Page (Admin Only)

`/internalaitools/settings` includes:

*   Add Tool form
*   Edit Tool in a modal/card
*   Delete with confirmation
*   Full table layout
*   Auto refresh after mutations
*   Logout button

Admin is required for any **POST / PUT / DELETE** operations.

***

## 🧱 Tech Stack

*   **Next.js 16 (App Router + Route Groups)**
*   **React Server Components**
*   **Next.js Route Handlers** for API (`route.ts`)
*   **HttpOnly cookie-based auth**
*   **Modern dark theme UI with custom CSS**
*   Optional **Vercel KV** for persistence

***

## 🛠 Environment Variables

Create `.env.local`:

```env
ADMIN_PASSWORD=your-password
KV_REST_API_URL=        # optional
KV_REST_API_TOKEN=      # optional
```

***


## 📄 License

This is an internal/private tool.  



