# 🏚️ Long Gone — Haunted House Real Estate

> **ITCS223 — Introduction to Web Development | Phase II**
> **Section 2, Group 7 — Mahidol University, Faculty of ICT**

---

## 📖 Project Overview

**Long Gone** is a creative web application for browsing, buying, and renting haunted houses across Thailand. The platform was conceived for thrill-seekers, paranormal enthusiasts, and would-be ghostbusters who want to experience life inside properties with documented supernatural histories. Each listing has been investigated by our specialist team and rated on a 5-skull "spirit rating" scale before being published.

The current Phase II submission delivers the full front-end and front-end logic (with an in-browser data store using `localStorage` to simulate persistence). The back-end / Node.js web services and MySQL database described in the project brief are wired in via the same `LG` data module so that swapping the storage layer for real REST endpoints is a one-file change.

---

## 👥 Team Members — Section 2, Group 7

| Name                       | Student ID |
| -------------------------- | ---------- |
| Adisorn Vechkultumrong     | 6788142    |
| Rachen Chaothai            | 6788186    |
| Chavanon Opaspakkthon      | 6788202    |
| Chindanai Panitponkang     | 6788203    |

---

## ⚙️ Requirements

To run this project locally you will need:

- A **modern web browser** (Chrome, Edge, Firefox, or Safari — latest version recommended).
- **Node.js v18 or newer** (only required to run the optional local static server, see "How to Run" below). Download from <https://nodejs.org>.
- **(Optional) Postman** — for testing the back-end web services in Phase II Task 3.
- **(Optional) MySQL 8.x** — when the SQL dump is imported for the back-end task.

> The front-end pages are pure HTML/CSS/JavaScript and contain **no build step**. They can be opened directly in a browser without any installation, but serving them from a local server is recommended so that JavaScript `localStorage` persistence works correctly between pages.

---

## 📁 Project Structure

```
sec2_gr7_fe_src/
├── README.md                ← this file
├── homepage.html            ← landing page (hero + carousel + Why Long Gone)
├── buy.html                 ← browse houses for sale
├── rent.html                ← browse houses for rent
├── team.html                ← team member page
├── house-detail.html        ← detail page (templated, fetches by ?id=)
├── search-result.html       ← search-results template
├── success.html             ← shared success/confirmation screen
├── admin-login.html         ← admin authentication page
├── dashboard.html           ← admin Product Management dashboard (CRUD)
├── add-house.html           ← admin: add new property
├── edit-house.html          ← admin: edit existing property
├── edit-name.html           ← admin sub-page: edit name only
├── edit-price.html          ← admin sub-page: edit price only
└── edit-image.html          ← admin sub-page: upload new image
```

---

## 🚀 Installation Steps

### Step 1 — Download or clone the project

```bash
git clone <repository-url> sec2_gr7_fe_src
cd sec2_gr7_fe_src
```

…or simply unzip the submission archive and `cd` into the folder.

### Step 2 — Install dependencies

The **front-end has no dependencies** — every CSS and JavaScript dependency is loaded from a public CDN (Google Fonts and Picsum Photos). No `npm install` is needed for Phase II Task 1.

For the back-end services (Phase II Task 3), navigate to `sec2_gr7_ws_src/` and run:

```bash
cd ../sec2_gr7_ws_src
npm install
```

### Step 3 — Import the database (back-end task)

```bash
mysql -u root -p < sec2_gr7_database.sql
```

This creates the `longgone` database with all required tables (House, HouseCategory, Photo, Area, Customer, Admin, AdminAccount, HouseBroker, Rating, Manage, Contain, RequestViewing) and inserts at least 10 rows per table.

### Step 4 — Start the back-end web service (Node.js)

```bash
cd sec2_gr7_ws_src
node server.js
```

The web service listens on `http://localhost:3000` by default.

### Step 5 — Start the front-end server

The simplest way is using Node's built-in `http-server`:

```bash
# from inside sec2_gr7_fe_src/
npx http-server . -p 8080 -c-1
```

…or with Python:

```bash
python3 -m http.server 8080
```

…or with VS Code's "Live Server" extension (right-click `homepage.html` → *Open with Live Server*).

---

## 🌐 How to Run the Project

After both servers are running, open your browser to:

| Purpose         | URL                                           |
| --------------- | --------------------------------------------- |
| Homepage        | <http://localhost:8080/homepage.html>         |
| Buy listings    | <http://localhost:8080/buy.html>              |
| Rent listings   | <http://localhost:8080/rent.html>             |
| Team page       | <http://localhost:8080/team.html>             |
| Admin login     | <http://localhost:8080/admin-login.html>      |

**Test admin credentials:**

| Username | Password |
| -------- | -------- |
| `Ryu`    | `555`    |

---

## ✨ Features

### Public site (no login required)

- **Homepage** — hero with haunted-house background image, prominent search filters, an auto-rotating featured-houses **carousel** (with prev / next arrows and dot indicators), and a three-card "Why Long Gone?" section.
- **Buy / Rent pages** — browse all listings of one type, filter by **3 criteria** (Category, Rating, Location), click a card to open the detail page.
- **House detail page** — full image gallery (3 photos per listing) with thumbnails, spirit rating, price, location, contact info, and a **"Request a Viewing"** modal form.
- **Team page** — 4 member cards with name, ID, faculty, and a personal social-media link.
- **Sticky navigation bar** on every page linking back to all main sections (Buy / Rent / Our Team / Long Gone home / Admin).

### Admin features (login required)

- **Authenticated login page** with Remember-me, password show/hide, and validation.
- **Product Management dashboard** — live stats, full table view of every listing, search box, and CRUD actions (View, Edit, Delete).
- **Add New House** — quick-add modal accessible from the dashboard search bar.
- **Edit House** — dedicated page for changing image, name, price, description, location.
- **Profile dropdown** in the top-right corner of the dashboard with **Sign Out**.
- **Inline admin bar on detail pages** — when logged in, every property page shows an "Edit This House" shortcut.

### Search criteria (≥ 3, per rubric)

1. **Type / Intent** — Buy or Rent
2. **Category** — Mansion, Cottage, Villa, or All
3. **Rating** — Any, 3+, 4+, or 5 skulls
4. **Location** — free-text city/postcode/address keyword

### CRUD on properties (Product Management)

| Action  | Where                             |
| ------- | --------------------------------- |
| Create  | Dashboard → "+ Add New House"      |
| Read    | Dashboard table / Buy / Rent / Detail |
| Update  | Dashboard → Edit → edit-house.html |
| Delete  | Dashboard → trash icon → confirm   |

### Other UX touches

- Responsive design for desktop, tablet, and mobile.
- CSS custom properties (variables) for consistent theming.
- Semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- CSS selectors used: element, class, ID, descendant, pseudo-class — at least one of each on every page.
- Smooth animations (fade-up hero, popIn modals, slideUp toast).

---

## 🔌 Web Services (Task 3)

Implemented in `sec2_gr7_ws_src/` (separate folder, runs on port 3000):

| Service             | Method | Endpoint                       | Purpose                                |
| ------------------- | ------ | ------------------------------ | -------------------------------------- |
| Authentication      | POST   | `/auth/login`                  | Admin login (returns JWT/session)      |
| Search              | GET    | `/houses?location=&rating=&type=` | Multi-criteria property search       |
| View one            | GET    | `/houses/:id`                  | Get one property by id                 |
| Insert              | POST   | `/houses`                      | Create new property                    |
| Update              | PUT    | `/houses/:id`                  | Update an existing property            |
| Delete              | DELETE | `/houses/:id`                  | Delete a property                      |

Public web service used: **Google Maps Embed API** — used on the house-detail page to show each property's location.

Each service has at least 2 Postman test cases documented in the comments above the route in `sec2_gr7_ws_src/routes/*.js`.

---

## 🧪 Testing

A Postman collection is included at `sec2_gr7_ws_src/postman/LongGone.postman_collection.json`. To use:

1. Open Postman.
2. *File → Import →* select the JSON file.
3. Make sure the back-end is running on `http://localhost:3000`.
4. Run the collection — every endpoint has 2 test cases (success + failure).

---

## 📝 Notes & Known Limitations

- **Phase II front-end persistence**: data is stored in browser `localStorage` so each browser/profile maintains its own copy. Clearing site data resets the catalogue to the original 8 seed records.
- The **drag-and-drop image upload** in `edit-image.html` reads files via `FileReader` and stores them as base64 in `localStorage`. Large uploads may exceed `localStorage`'s typical 5 MB quota.
- The blood-drip SVG in the homepage hero is intentionally decorative and contained in the page (no external image dependency).

---

## 🌟 Extra Features (beyond requirements)

- **Auto-rotating image carousel** on the homepage with manual navigation.
- **Profile dropdown** with sign-out on the admin dashboard.
- **Live search** in the admin table (searches name + id + location simultaneously).
- **Inline admin edit bar** on every detail page when logged in.
- **Toast notifications** for every CRUD action.
- **Smooth fade-up and pop-in animations** throughout.
- **Spirit-skull rating system** (☠️) — a custom rating UI consistent with the brand.

---

## 🙏 Credits

- Fonts: [Google Fonts — Cinzel & Crimson Text](https://fonts.google.com)
- Placeholder photos: [Picsum Photos](https://picsum.photos) and [Unsplash](https://unsplash.com)
- Icons: native SVG, no third-party icon library

---

&copy; 2024 Long Gone — All Spirits Reserved.
