# 🍲 FoodBridge – Smart Food Waste to Donation System

> **Tagline:** *"Save Food. Share Hope. Feed Lives."*  
> **Mission:** Reducing food wastage by connecting surplus food donors (restaurants, hotels, supermarkets, caterers) with verified NGOs, shelters, orphanages, and communities in need using real-time geolocation matching and a 6-step verified distribution tracking pipeline.

---

## 🌟 Executive Summary

Globally, one-third of all food produced is wasted while millions experience nutritional insecurity. **FoodBridge** bridges this logistical and temporal divide through modern web engineering:
- **Food Donors** (restaurants, banquets, grocery stores, bakeries, individuals) upload details of excess edible food, complete a certified food safety declaration, and set pickup windows.
- **NGOs & Food Banks** view nearby food items on interactive OpenStreetMaps, receive urgency alerts for items expiring within 4 hours, and claim donations with one tap.
- **6-Step Interactive Lifecycle Tracker** follows the donation journey with a cryptographic/OTP pickup code from listing to delivery to table.
- **Impact Analytics (Recharts)** calculate meals provided, kg diverted from landfills, and CO₂ emissions averted.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18 (Vite), Tailwind CSS, Lucide React icons, Canvas Confetti |
| **Maps & Geolocation** | OpenStreetMap, Leaflet & React-Leaflet (Interactive zero-key mapping) |
| **Data Visualizations** | Recharts (Line Charts, Pie Charts, Bar Charts) |
| **Backend API** | Node.js, Express.js |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs password hashing, Role-Based Access Control |
| **Database** | **Dual-Engine Architecture:** Native MongoDB with Mongoose ORM **plus** an integrated zero-config adaptive persistent store (runs out-of-the-box on any machine even if MongoDB is not locally installed!) |

---

## 🚀 Key Features

### 1. 🍽️ Available Food Donations & OpenStreetMap
- Filter by category: *Cooked Food, Fruits & Vegetables, Bakery & Bread, Packaged Food, Dairy Products, Beverages*.
- **Urgency Alerts:** Dynamic real-time countdown badge highlighting food approaching expiry within 4 hours (`animate-pulse`).
- **Interactive OpenStreetMap:** Switch between responsive card grid and interactive map view showing pinned donations with distance and one-click claim popups.

### 2. 👨‍🍳 Food Donor Portal
- Personalized welcome dashboard displaying total kg donated, pending claims, and active listings.
- **Add Surplus Donation Form:** Fields for food name, category, quantity, unit, preparation timestamp, expiry window, photo presets or custom image URL, pickup address, and handling notes.
- **Food Safety Declaration:** Mandatory hygiene compliance confirmation.
- One-click approval / rejection of incoming NGO requests.

### 3. 🤝 NGO / Receiver Portal
- **Smart Matching Engine:** AI-scored recommendations ranking available food based on proximity, urgency, and shelter capacity.
- One-click food claiming with intended beneficiary count (e.g. *"Distributing to 45 children at Hope Shelter"*).
- Active pickup manager and historical delivery records.

### 4. 🚚 6-Step Visual Progress Tracker
Every donation follows an audited 6-step lifecycle:
1. **Donation Posted** – Surplus food listed by donor.
2. **Request Received** – NGO claims servings for community.
3. **Request Approved** – Donor authorizes pickup; 4-digit code generated (e.g., `FB-9418`).
4. **Food Ready for Pickup** – Kitchen packages food in thermal/safe containers.
5. **Food Picked Up** – Volunteer driver confirms collection with handover code.
6. **Successfully Delivered** – Food served to beneficiaries; impact metrics logged and celebratory confetti launched!

### 5. 🛡️ Admin Moderation & Analytics Panel
- Platform KPI counters: Registered users, active donors, verified NGOs, food rescued, CO₂e averted.
- **Recharts Visualizations:** Monthly food recovery trends and category breakdown.
- **NGO Verification:** One-click toggle to grant verified badge to charitable shelters.
- **User Management & Post Moderation:** Suspend abusive accounts or remove invalid food listings.
- **Report Generator:** One-click simulated export of platform audit logs.

### 6. 🧮 Food Waste Impact Calculator
- Interactive slider on the homepage allowing any restaurant or organizer to calculate immediate impact: meals served, kg CO₂ avoided, and water saved.

---

## 👥 Demo Accounts (Fast Presentation)

For fast evaluation and live presentations, FoodBridge provides **1-Click Demo Login** shortcuts in the navigation bar and on the login page:

| Role | Email | Password | Persona & Organization |
|---|---|---|---|
| **Food Donor** | `donor@restaurant.com` | `password123` | Chef Marco Silva, *Golden Spoon Fine Dining* |
| **Wedding Caterer** | `events@royalpalace.com` | `password123` | Priya Sharma, *Royal Palace Banquet Hall* |
| **NGO / Receiver** | `ngo@robinhood.org` | `password123` | Aarav Patel, *Robin Hood Army Community Kitchen* |
| **Orphanage Shelter** | `hope@charity.org` | `password123` | Sister Maria, *Hope Children Shelter & Orphanage* |
| **Administrator** | `admin@foodbridge.org` | `admin123` | Central Administration & Compliance Supervisor |

*(You can also register a new account anytime under either Donor or NGO role!)*

---

## 💻 Installation & Local Setup

### Prerequisites
- **Node.js** (v18 or higher recommended; tested on v25)
- **npm** (v9 or higher)

### Option A: Unified Production Mode (Fastest — 1 Command)
The React client is pre-built into `client/dist`. The Express server automatically serves both the backend REST APIs and the compiled frontend application from a single port!

```bash
# Navigate to foodbridge directory
cd C:\Users\ASUS\.gemini\antigravity\scratch\foodbridge

# Start unified server
npm start
```
Open your browser to: **`http://localhost:5000`**

---

### Option B: Development Mode (Hot-Reloading)

To run both client and server simultaneously with hot module replacement:

#### Terminal 1: Backend Server (Port 5000)
```bash
cd C:\Users\ASUS\.gemini\antigravity\scratch\foodbridge\server
npm install
npm run dev
```

#### Terminal 2: Vite React Frontend (Port 3000)
```bash
cd C:\Users\ASUS\.gemini\antigravity\scratch\foodbridge\client
npm install
npm run dev
```

Open your browser to: **`http://localhost:3000`** (Requests to `/api` automatically proxy to port 5000).

---

## 🗄️ Database Architecture

FoodBridge features a **Dual-Mode Adapter**:
1. **Native MongoDB Mode:** If `MONGODB_URI` in `server/.env` points to a reachable MongoDB instance (local or MongoDB Atlas), Mongoose connects natively.
2. **Integrated Persistent Store:** If MongoDB is not running locally, FoodBridge activates its zero-config JSON file store (`server/data/store.json`). It provides identical Mongoose query syntax (`find`, `findById`, `create`, `findByIdAndUpdate`, `insertMany`) and persists data across server restarts without crashing.

### Collections / Entities:
- **`Users`**: Donors, NGOs, and Admins with hashed credentials, organization profiles, and verification badges.
- **`FoodDonations`**: Title, category, quantity, unit, preparation time, expiry countdown, image, GPS coordinates, pickup window, food safety certification.
- **`DonationRequests`**: Requested servings, purpose note, verification pickup code (`FB-XXXX`), status history audit log.
- **`Notifications`**: Real-time notifications for nearby food postings, request claims, approvals, and status transitions.
- **`NGOProfiles`**: Registration numbers, daily meal capacity, coverage radius, verified status.
- **`ContactMessages`**: Inquiries and volunteer partnership applications.

---

## 📡 REST API Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` – Register donor or NGO account
- `POST /api/auth/login` – Sign in and obtain JWT
- `POST /api/auth/demo-login` – Instant 1-click login for demonstration personas
- `GET /api/auth/me` – Retrieve current profile

### Food Donations (`/api/donations`)
- `GET /api/donations` – Query donations with search, category, urgency, and location filters
- `GET /api/donations/featured` – Top active urgent donations for home page
- `GET /api/donations/matching` – Smart AI proximity & urgency matching for NGOs
- `GET /api/donations/my-donations` – Donor's own donation listings
- `GET /api/donations/:id` – Detailed food specifications
- `POST /api/donations` – Create new surplus food donation (Donor)
- `PUT /api/donations/:id` – Edit listing
- `DELETE /api/donations/:id` – Delete listing

### Donation Requests & Tracking (`/api/requests`)
- `POST /api/requests` – Submit food claim with serving requirements (NGO)
- `GET /api/requests/donor` – View incoming claims on donor's listings
- `GET /api/requests/ngo` – View active food claims made by NGO
- `GET /api/requests/:id` – Full 6-step tracking status and history log
- `PUT /api/requests/:id/status` – Advance lifecycle status (`approved`, `ready_for_pickup`, `picked_up`, `delivered`)

### Admin Management (`/api/admin`)
- `GET /api/admin/stats` – Overall platform KPIs
- `GET /api/admin/analytics` – Recharts monthly recovery trends and category distribution
- `GET /api/admin/users` – User list with role filters
- `PUT /api/admin/users/:id/verify` – Verify NGO account
- `PUT /api/admin/users/:id/status` – Toggle user active / suspended
- `GET /api/admin/donations` – Moderate all platform food listings
- `DELETE /api/admin/donations/:id` – Remove reported or expired post

### System & Contact (`/api`)
- `GET /api/health` – Server health check, uptime, and database driver info
- `POST /api/contact` – Submit contact / support form

---

## 🎓 College Project Walkthrough Guide

When presenting this project to evaluators:

1. **Introduction (1 min):**
   - Start on **Home Page** (`http://localhost:5000`). Highlight the problem: food waste vs hunger.
   - Show the **Interactive Impact Calculator**: slide from 10 kg to 50 kg to reveal live meals fed and CO₂ offset.

2. **Donor Journey (2 mins):**
   - Click **Demo Accounts > Donor (Chef Marco)** in top right.
   - Notice the **Donor Dashboard**: active listings, total kg donated, pending NGO requests.
   - Click **"+ Donate Food"** to open the registration form. Fill in an item (e.g. *"40 Gourmet Buffet Meal Boxes"*), select a category and prep/expiry times, check the **Food Safety Declaration**, and click Submit.

3. **NGO Claim & Map View (2 mins):**
   - Click **Demo Accounts > NGO (Robin Hood Army)**.
   - Head to **Available Food** (`/donations`).
   - Toggle to **OpenStreetMap** view: show how donations are pinned geographically across the city.
   - Filter by **"Expiring Soon (< 4 hrs)"** to demonstrate urgency prioritization.
   - Click **"Request Food"** on a donation, enter beneficiary details (*"50 children dinner"*), and submit.

4. **Live 6-Step Tracking Engine (2 mins):**
   - You are immediately redirected to `/tracking/:id`.
   - Walk through the visual 6-step progress bar and highlight the generated **Pickup Code** (e.g. `FB-9418`).
   - Click the interactive status buttons:
     - Stage 3: *"Approve Request"*
     - Stage 4: *"Mark Ready for Pickup"*
     - Stage 5: *"Confirm Food Picked Up"*
     - Stage 6: *"Confirm Successfully Delivered"* → **Confetti celebration triggers!**

5. **Admin Portal & Analytics (1.5 mins):**
   - Click **Demo Accounts > Admin Supervisor**.
   - Navigate to `/admin`. Show the **Recharts** monthly impact line chart and category pie chart.
   - Click **User & NGO Management** tab: demonstrate 1-click **"Verify NGO"** button.
   - Click **"Generate Platform Report"** to preview the audit summary.

---

## 📄 License
This project is open-source under the MIT License for educational and social good demonstrations.
