# SyncSpace: Operations Command Hub

SyncSpace is a lightweight, real-time web application designed for IT support engineering teams to manage ticket round-robin assignments, track shared phone line availability, and audit daily metrics. 

Built with an emphasis on speed and accountability, the application ensures fair workload distribution while allowing for uncapped ticket concurrency.

![Tech Stack](https://img.shields.io/badge/Tech_Stack-React_|_Vite_|_Tailwind_v4_|_Supabase-blue?style=for-the-badge)

---

## 🚀 Key Features

*   **Uncapped Round-Robin Dispatcher:** Automatically highlights the "Next In Line" engineer based on wait time. Agents can claim multiple tickets concurrently without breaking the queue order.
*   **Unified 'Suivi' (Audit) Hub:** A centralized control panel replacing scattered modals. Engineers input mandatory Ticket IDs to claim turns, manage active workloads, and view a live-updating audit log of the team's entire day.
*   **Ticket Lifecycle Management:** Tickets aren't just "busy/done". Agents can **Suspend/Hold**, **Escalate**, or **Resolve** tickets, with real-time UI badges reflecting the state.
*   **"Retreat" (Away/Break) Status:** Engineers can toggle a "Break" state, automatically skipping them in the round-robin queue. When they return, they seamlessly re-enter the queue without losing their accrued wait-time priority.
*   **Shared Comm Line Tracker:** A dedicated widget preventing collisions on a single shared support phone.
*   **Live Extended Metrics:** Real-time dashboard showing both Global (Team) and Personal tallies for Completed, Escalated, Suspended tickets, and Calls Handled.
*   **Premium Dark/Light Mode:** A bespoke "Deep Space Blue & Cyan" dark mode, toggleable to a crisp, high-contrast light mode, persisted via local storage.

---

## 🛠️ Technology Stack

*   **Frontend:** React 18, TypeScript, Vite
*   **Styling:** Tailwind CSS v4, Lucide React Icons
*   **Backend & Database:** Supabase (PostgreSQL)
*   **Real-time Sync:** Supabase Realtime (WebSockets)
*   **Deployment:** Vercel

---

## 🧠 Core Algorithms & Mechanisms

### The "Least Recently Assigned" Round-Robin
Unlike rigid turn-based systems where one person getting stuck holds up the queue, SyncSpace uses a fluid time-based algorithm:
1.  The system constantly evaluates all engineers whose status is `available`.
2.  It compares their `last_ticket_assigned_at` timestamps.
3.  The engineer who has waited the longest since their last claim is flagged as **Next In Line**.
4.  When an engineer claims a ticket, their timestamp resets to `NOW()`, pushing them to the back of the line.

### Uncapped Concurrency
Engineers are no longer locked into a binary "Busy" state when they claim a ticket. The system allows an agent to hold 5 suspended tickets and 2 active tickets simultaneously while remaining "Available" in the rotation, ensuring high-performers aren't bottlenecked by slow-resolving issues.

### Daily Metrics Rest (The Checkpoint System)
Instead of deleting historical data every night, the "Reset Metrics" button drops a `metrics_reset_at` timestamp in the global `app_state` table. The UI then queries the database for logs and tickets created *after* this checkpoint. This preserves the database integrity for long-term historical analytics while keeping the daily dashboard clean.

---

## 🗄️ Database Schema (Supabase)

The application relies on three primary tables in PostgreSQL:

**1. `engineers`**
Tracks the team members and their queue priority.
*   `id` (UUID)
*   `name` (Text)
*   `status` (Text: 'available', 'offline', 'retreat')
*   `last_ticket_assigned_at` (Timestamptz)

**2. `tickets`**
Tracks the lifecycle of individual tasks.
*   `id` (UUID)
*   `engineer_id` (UUID, Foreign Key)
*   `short_id` (Text) - *The mandatory user-provided Ticket ID*
*   `status` (Text: 'active', 'suspended', 'escalated', 'closed')
*   `created_at` / `updated_at` (Timestamptz)

**3. `app_state`**
A singleton table (only 1 row) managing global environment variables.
*   `id` (Int = 1)
*   `phone_occupied_by` (UUID, Foreign Key, Nullable)
*   `metrics_reset_at` (Timestamptz)

---

## ⚙️ Setup & Deployment Guide

### 1. Local Development Setup
Clone the repository and install dependencies:
```bash
git clone https://github.com/Ab-Amm/ticket-tracker.git
cd ticket-tracker
npm install
```
Start the local server (It will default to "Local Demo Mode" if Supabase isn't linked):
```bash
npm run dev
```

### 2. Supabase Backend Setup
1. Create a free account at [Supabase](https://supabase.com/).
2. Create a new project.
3. Open the **SQL Editor** in your Supabase dashboard.
4. Copy the contents of `supabase/schema.sql`, `supabase/02_advanced_tickets.sql`, and `supabase/03_retreat_status.sql` from this repository and run them in order. This sets up the tables, the RLS policies, and enables Realtime WebSockets.
5. Go to **Project Settings -> API** to get your URL and Anon Key.

### 3. Linking the App to Supabase
Create a `.env.local` file in the root of your project:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Deploying to Vercel
You can deploy this instantly using the Vercel CLI:
```bash
npm i -g vercel
vercel --prod
```
*Don't forget to add your Supabase Environment Variables into the Vercel Dashboard settings after deployment!*

---

## 🤝 Team Protocol

To ensure perfect accountability, the team should adopt this workflow:
1. **Morning Reset:** The first engineer online clicks the "Refresh" icon next to Daily Metrics to set the day's checkpoint.
2. **Mandatory IDs:** When a ticket arrives via an external system (Jira, ServiceNow), the person tagged "Next In Line" copies the ID, pastes it into the SyncSpace claim form, and submits.
3. **Breaks:** If leaving the desk, toggle the "Break" icon in the System Status card to temporarily remove yourself from the rotation. Click "Resume" to instantly return to your proper place in line.