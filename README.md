# Stock Key Investments

A full stock broking + insurance web application built with **React + Vite + TypeScript + Tailwind CSS**, modelled on [stockkeyinvestments.in](https://stockkeyinvestments.in/).

> "Invest Smart. Earn Steady. Retire Early." — The key to your financial freedom.

## Quick start

```bash
npm install
npm run dev      # → http://localhost:5173
```

Build for production:

```bash
npm run build
npm run preview
```

## Demo accounts (pre-seeded)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@stockkey.in` | `admin123` |
| **Customer** | `customer@stockkey.in` | `customer123` |

You can also **register** a new customer account from the `/register` page.

## What's included

### Public / marketing site (mirrors the reference site)
- **Home** — hero, 3 investment plans (Premium ₹10L→₹40k/mo, Standard ₹5L→₹20k/mo, Customised), why-choose-us, insurance teaser, testimonial band, CTA
- **About Us** — story, values, SEBI-registered / NISM-certified trust badges, asset classes (Equities, Bonds, ETFs, IPOs, Options)
- **Investment Plans** — detailed plan cards, comparison table, "Start Investing" lead form
- **Insurance Hub** + category pages for **Health, Term, Car, Bike** (PolicyBazaar/Acko-style):
  - Browse plans from multiple insurers
  - Premium calculator (age + coverage sliders)
  - Plan comparison, ratings, claim-settlement rates
  - "Get Quote" lead form that saves to the database
- **Contact Us** — contact form, phone (`+91 70131 78382`), email (`info@stockkeyinvestments.in`)

### Authentication
- **Login** with role-based redirect (admin → `/admin`, customer → `/dashboard`)
- **Register** — customer self-signup with plan selection

### Customer portal (`/dashboard`)
- **Overview** — portfolio value, total returns, unrealised P&L, monthly payout, holdings preview, recent activity
- **My Portfolio** — full holdings table with P&L %, transaction history
- **Profile & KYC** — personal info, KYC status, investment details

### Admin panel (`/admin`)
- **Dashboard** — analytics: total customers, AUM, leads + charts (payouts trend, plan distribution, asset allocation) and recent leads
- **Customers** — full CRUD (add / edit / delete), search, status filter, detail view with holdings
- **Portfolios** — every customer's holdings & performance
- **Insurance Leads** — manage enquiries from insurance pages (status workflow, notes)
- **Investment Leads** — manage "Start Investing" form submissions

## Data & architecture

This is a **client-side app** with a mock database backed by `localStorage` — no backend setup required. All data (customers, portfolios, insurance plans, leads, auth) persists in the browser across reloads.

- `src/context/DataContext.tsx` — mock DB (customers, leads, plans, CRUD ops)
- `src/context/AuthContext.tsx` — login / register / logout, role-based access
- `src/data/seed.ts` — seed users, customers, portfolios, insurance plans, leads
- `src/components/RouteGuards.tsx` — `ProtectedRoute` (any user) + `AdminRoute` (admin only)

> **Note:** Passwords are stored in plaintext in `localStorage` only because this is a demo. To make this production-ready, swap `DataContext`/`AuthContext` for a real backend (Express + MongoDB or Supabase) — the UI and data shapes map directly.

## Tech stack

- React 18 + Vite + TypeScript
- Tailwind CSS (custom brand theme)
- React Router v6 (nested routes, layout + guard patterns)
- Recharts (admin dashboard analytics)

## Project structure

```
src/
├── main.tsx                 # providers: Router > Data > Auth
├── App.tsx                  # routes
├── context/                 # DataContext, AuthContext (mock DB + auth)
├── data/seed.ts             # seed data
├── types/index.ts           # domain types
├── lib/utils.ts             # INR formatting, portfolio math
├── components/              # Navbar, Footer, Layout, RouteGuards,
│   ├── ui/                  #   Button, Badge, Modal, StatCard
│   ├── DashboardShell.tsx   # customer + admin sidebar layout
│   ├── LeadForm.tsx         # reusable lead/enquiry form
│   └── icons.tsx            # inline SVG icons
└── pages/
    ├── public/              # Home, About, InvestmentPlans, Insurance*, Contact
    ├── auth/                # Login, Register
    ├── customer/            # Dashboard, Portfolio, Profile
    └── admin/               # AdminDashboard, AdminCustomers, AdminPortfolios, AdminLeads
```

## Resetting demo data

To wipe all changes and restore the original seed data, clear your browser's localStorage for the site (or run `localStorage.clear()` in the console), then reload.
