# 🏚️ Long Gone — Haunted House Real Estate

> **ITCS223 — Introduction to Web Development | Phase II**  
> **Section 2, Group 3 — Mahidol University, Faculty of ICT**

---

## 📖 Project Overview

**Long Gone** is a web application for browsing, buying, and renting haunted houses across Thailand. The platform is built for thrill-seekers, paranormal enthusiasts, and ghostbusters who want to experience life inside properties with documented supernatural histories. Each listing is investigated by our specialist team and rated on a 5-skull "spirit rating" scale before being published.

The submission covers:

- **Task 1 & 4** — Full front-end (HTML/CSS/JS) with Fetch API calls to the back-end web services (`sec2_gr3_fe_src/`)
- **Task 2** — MySQL database schema + seed data (`sec2_gr3_database.sql`)
- **Task 3** — Node.js/Express web services (`sec2_gr3_ws_src/app.js`)

---

## 👥 Team Members — Section 2, Group 3

| Name                       | Student ID |
| -------------------------- | ---------- |
| Adisorn Vechkultumrong     | 6788142    |
| Rachen Chaothai            | 6788186    |
| Chavanon Opaspakkthon      | 6788202    |
| Chindanai Panitponkang     | 6788203    |

---

## ⚙️ Requirements

| Tool | Version | Purpose |
| ---- | ------- | ------- |
| **Node.js** | v18 or newer | Run both front-end static server and back-end web service |
| **MySQL** | 8.x | Database server |
| **npm** | bundled with Node.js | Install back-end dependencies |
| **Modern browser** | Chrome / Edge / Firefox (latest) | Access the front-end |
| **Postman** *(optional)* | any | Test web service endpoints |

---

## 📁 Project Structure

```
📦 GitHub repository root
│
├── sec2_gr3_fe_src/             ← Task 1 & 4: front-end source files
│   ├── README.md                ← this file
│   ├── homepage.html            ← landing page (hero + carousel + search)
│   ├── buy.html                 ← browse houses for sale
│   ├── rent.html                ← browse houses for rent
│   ├── team.html                ← team members page
│   ├── house-detail.html        ← property detail (fetches by ?id=)
│   ├── search-result.html       ← search results page
│   ├── success.html             ← shared confirmation screen
│   ├── admin-login.html         ← admin authentication page
│   ├── dashboard.html           ← admin Product Management (CRUD)
│   ├── add-house.html           ← admin: add new property
│   ├── edit-house.html          ← admin: edit existing property
│   ├── edit-name.html           ← admin: edit property name
│   ├── edit-price.html          ← admin: edit property price
│   └── edit-image.html          ← admin: upload property image
│
├── sec2_gr3_ws_src/             ← Task 3: back-end web service
│   ├── app.js                   ← Express server (all 6 routes defined here)
│   ├── package.json             ← dependencies: express, mysql2, dotenv, cors
│   └── .env                     ← environment variables (see Step 3 below)
│
└── sec2_gr3_database.sql        ← Task 2: MySQL schema + seed data
```

---

## 🚀 Installation & Setup (Step-by-Step)

### Step 1 — Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

---

### Step 2 — Import the database

Make sure MySQL is running, then import the SQL file:

```bash
mysql -u root -p < sec2_gr3_database.sql
```

This creates the **`long_gone_db`** database and the following 12 tables:

| # | Table | Description |
|---|-------|-------------|
| 1 | `HouseCategory` | Property categories (Mansion, Cottage, Villa…) |
| 2 | `Area` | Geographic locations (Province / District / Subdistrict / Zipcode) |
| 3 | `House` | Core property listings |
| 4 | `Photo` | Property images linked to each House |
| 5 | `Customer` | Customer accounts |
| 6 | `Admin` | Admin staff info + password |
| 7 | `AdminAccount` | Admin login accounts (linked to Admin) |
| 8 | `HouseBroker` | Broker staff (linked to Admin) |
| 9 | `Rating` | Customer ratings per house (composite PK: RCustomerID + RHouseID) |
| 10 | `Manage` | Admin CRUD action log per house (composite PK: MAdminAccID + MHouseID) |
| 11 | `Contain` | House ↔ Category mapping (composite PK: CHouseID + CcategoryID) |
| 12 | `RequestViewing` | Customer viewing requests (composite PK: VCustomerID + VHouseID) |

Each table contains **at least 10 seed rows** as required by the marking criteria.

---

### Step 3 — Configure the back-end environment

Navigate into the web-service folder and create a `.env` file:

```bash
cd sec2_gr3_ws_src
```

Create a file named `.env` with the content below (replace values to match your MySQL setup):

```env
HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=long_gone_db
PORT=3000
```

> ⚠️ `.env` is listed in `.gitignore` — never commit it to GitHub.

---

### Step 4 — Install back-end dependencies

```bash
# inside sec2_gr3_ws_src/
npm install
```

Packages installed: `express`, `mysql2`, `dotenv`, `cors`.

---

### Step 5 — Start the back-end web service

```bash
node app.js
```

Expected console output:

```
Connected DB: long_gone_db
Server listening on port: 3000
```

The API is now available at **`http://localhost:3000`**.

---

### Step 6 — Start the front-end server

Open a **new terminal**, go to the front-end folder, and start a static file server:

```bash
cd ../sec2_gr3_fe_src

# Option A — npx http-server (recommended, no install needed)
npx http-server . -p 8080 -c-1

# Option B — Python
python3 -m http.server 8080

# Option C — VS Code
# Right-click homepage.html → "Open with Live Server"
```

---

## 🌐 How to Access the Application

With both servers running, open your browser:

| Page | URL |
| ---- | --- |
| Homepage | <http://localhost:8080/homepage.html> |
| Buy listings | <http://localhost:8080/buy.html> |
| Rent listings | <http://localhost:8080/rent.html> |
| Team page | <http://localhost:8080/team.html> |
| Admin login | <http://localhost:8080/admin-login.html> |
| Admin dashboard | <http://localhost:8080/dashboard.html> *(redirects if not logged in)* |

**Front-end demo credentials (stored in sessionStorage):**

| Username | Password |
| -------- | -------- |
| `Ryu` | `555` |

**Back-end API credentials** use `AdminID` and `Password` from the `Admin` table in `long_gone_db`. Use the `POST /admin/login` endpoint (see Web Services section below).

---

## ✨ Features

### Public (no login required)

- **Homepage** — hero with haunted-house background image, 4-criteria search bar (intent / category / rating / location), auto-rotating featured-houses **carousel** (prev/next + dot indicators), and three-card "Why Long Gone?" section.
- **Buy / Rent pages** — browse properties filtered by **3 criteria**: Category, Rating, Location. Cards link to the detail page.
- **House detail** — 3-photo gallery with thumbnail navigation, spirit-skull rating, price, location map, contact info, and a **"Request a Viewing"** modal form.
- **Team page** — 4 member cards with name, student ID, and faculty.
- **Sticky navigation bar** on every page linking to Buy / Rent / Our Team / Home / Admin.

### Admin (login required)

- **Authenticated login** — username/password form with Remember-me, password show/hide toggle, and error feedback.
- **Product Management dashboard** — stats summary cards, full property table with live search, and View / Edit / Delete action buttons.
- **Add New House** — quick-add modal form accessible directly from the search toolbar.
- **Edit House** — dedicated page to change image, name, price, description, and location.
- **Profile dropdown** top-right with admin name and Sign Out button.

### CRUD Summary

| Operation | Front-end trigger | API endpoint called |
| --------- | ----------------- | ------------------- |
| **Create** | Dashboard → + Add New House | `POST /houses` |
| **Read / Search** | Buy / Rent / Search pages | `GET /houses/search` |
| **Update** | Dashboard → Edit | `PUT /houses/:id` |
| **Delete** | Dashboard → Delete → confirm | `DELETE /houses/:id` |
| **Admin Login** | admin-login.html | `POST /admin/login` |

---

## 🔌 Web Services — `app.js` (Task 3)

Base URL: **`http://localhost:3000`**  
All routes are defined in `sec2_gr3_ws_src/app.js`.  
Request bodies use **raw JSON** (`Content-Type: application/json`).

---

### 1. Search Houses — `GET /houses/search`

Supports **3 optional query criteria** (any combination or none for all results):

| Query param | Type | Description |
| ----------- | ---- | ----------- |
| `category` | string | Exact match on `HouseCategory.CategoryName` e.g. `Mansion` |
| `rating` | number | Minimum average `RatingValue` from the `Rating` table |
| `location` | string | Partial `LIKE` match across AreaName, Province, District, Subdistrict, Zipcode |

Returns: `{ count, data[] }` — array of houses with `avgRating` included.

**Test case 1 — category + location:**
```
GET http://localhost:3000/houses/search?category=Mansion&location=Bangkok
```
Expected → `200 OK` with houses whose category is "Mansion" and area contains "Bangkok".

**Test case 2 — rating + location:**
```
GET http://localhost:3000/houses/search?rating=4&location=Chiang
```
Expected → `200 OK` with houses whose average rating ≥ 4 and area contains "Chiang".

---

### 2. Insert House — `POST /houses`

Creates a new record in the `House` table.

**Required body fields:** `HouseID`, `HouseName`, `HousePrice`, `bedroomCount`, `bathroomCount`, `basementCount`, `HcategoryID`, `HAreaName`  
**Optional:** `Description`

**Test case 1 — success:**
```
POST http://localhost:3000/houses
Content-Type: application/json

{
  "HouseID": "H0000000010",
  "HouseName": "The Phantom Villa",
  "HousePrice": 2500000,
  "bedroomCount": 3,
  "bathroomCount": 2,
  "basementCount": 1,
  "Description": "A chilling three-storey villa with an infamous past.",
  "HcategoryID": "CAT00001",
  "HAreaName": "Salaya"
}
```
Expected → `201 Created` `{ "message": "House inserted successfully.", "HouseID": "H0000000010" }`

**Test case 2 — missing required field:**
```
POST http://localhost:3000/houses
Content-Type: application/json

{
  "HouseName": "Incomplete House"
}
```
Expected → `400 Bad Request` `{ "error": "Missing required fields." }`

---

### 3. Update House — `PUT /houses/:id`

Updates one or more fields of an existing `House` record.  
Send only the fields you want to change (any subset of the 8 allowed fields).

**Test case 1 — success:**
```
PUT http://localhost:3000/houses/H0000000001
Content-Type: application/json

{
  "HousePrice": 3500000
}
```
Expected → `200 OK` `{ "message": "House updated successfully.", "HouseID": "H0000000001" }`

**Test case 2 — house not found:**
```
PUT http://localhost:3000/houses/NOTEXIST
Content-Type: application/json

{
  "HouseName": "Ghost House"
}
```
Expected → `404 Not Found` `{ "error": "House 'NOTEXIST' not found." }`

---

### 4. Delete House — `DELETE /houses/:id`

Removes a `House` record by its `HouseID`.

**Test case 1 — success:**
```
DELETE http://localhost:3000/houses/H0000000001
```
Expected → `200 OK` `{ "message": "House deleted successfully.", "HouseID": "H0000000001" }`

**Test case 2 — house not found:**
```
DELETE http://localhost:3000/houses/NOTEXIST
```
Expected → `404 Not Found` `{ "error": "House 'NOTEXIST' not found." }`

---

### 5. Admin Register — `POST /admin/register`

Creates a new record in the `Admin` table.

**Required body fields:** `AdminID`, `Aname`, `AdminGmail`, `AdminPhoneNumber`, `Salary`, `Password`

**Test case 1 — success:**
```
POST http://localhost:3000/admin/register
Content-Type: application/json

{
  "AdminID": "ADM0000010",
  "Aname": "Somchai Jaidee",
  "AdminGmail": "somchai@longgone.th",
  "AdminPhoneNumber": "081-234-5678",
  "Salary": 35000.00,
  "Password": "securePass123"
}
```
Expected → `201 Created` `{ "message": "Admin registered successfully.", "AdminID": "ADM0000010" }`

**Test case 2 — duplicate AdminID:**
```
POST http://localhost:3000/admin/register
Content-Type: application/json

{
  "AdminID": "ADM0000010",
  "Aname": "Duplicate Admin",
  "AdminGmail": "dup@longgone.th",
  "AdminPhoneNumber": "081-000-0000",
  "Salary": 30000.00,
  "Password": "pass"
}
```
Expected → `409 Conflict` `{ "error": "AdminID 'ADM0000010' already exists." }`

---

### 6. Admin Login (Authentication) — `POST /admin/login`

Verifies `AdminID` and `Password` against the `Admin` table.  
Returns admin info (password excluded) on success.

**Test case 1 — correct credentials:**
```
POST http://localhost:3000/admin/login
Content-Type: application/json

{
  "AdminID": "ADM0000001",
  "Password": "securePass123"
}
```
Expected → `200 OK` `{ "message": "Login successful.", "admin": { "AdminID": "...", "Aname": "...", "AdminGmail": "...", ... } }`

**Test case 2 — wrong password:**
```
POST http://localhost:3000/admin/login
Content-Type: application/json

{
  "AdminID": "ADM0000001",
  "Password": "wrongPassword"
}
```
Expected → `401 Unauthorized` `{ "error": "Invalid AdminID or password." }`

---

## 🧪 Postman Testing

1. Open **Postman**.
2. Click **File → Import** and select `sec2_gr3_ws_src/postman/LongGone.postman_collection.json`.
3. Ensure MySQL is running and `node app.js` is active on port `3000`.
4. Set the base URL collection variable to `http://localhost:3000` if prompted.
5. Run each request — every endpoint has a success case and a failure/edge case pre-configured.

---

## 📝 Notes & Known Limitations

- **CORS** — `cors` is enabled globally in `app.js` so the front-end on port 8080 can call the back-end on port 3000 without browser security errors.
- **Plain-text passwords** — The `Admin.Password` column stores passwords as plain text for demo purposes. For production use a hashing library such as `bcrypt`.
- **Front-end fallback** — While the back-end is offline, the front-end uses browser `localStorage` (the shared `LG` data store) so all pages remain functional for demonstration.
- **Image uploads** — `edit-image.html` reads files with `FileReader` and stores base64 data in `localStorage`. Files larger than ~4 MB may exceed the browser storage quota.
- **`long_gone_db`** — the database name is defined in the SQL file and must match the `DB_NAME` value in your `.env`.

---

## 🌟 Extra Features (beyond requirements)

- **Auto-rotating homepage carousel** with prev/next arrows and dot-indicator navigation.
- **Profile avatar dropdown** on the admin dashboard (top-right) with Sign Out.
- **Live admin table search** — filters name, ID, and location simultaneously without a page reload.
- **Inline admin edit bar** at the bottom of every house-detail page when logged in.
- **Toast notifications** for every CRUD operation.
- **Smooth CSS animations** — fade-up hero, pop-in modals, slide-up toasts.
- **Spirit-skull rating system** (☠️) — 5-skull thematic rating display.

---

## 🙏 Credits

- Fonts: [Google Fonts — Cinzel & Crimson Text](https://fonts.google.com)
- Placeholder images: [Picsum Photos](https://picsum.photos) · [Unsplash](https://unsplash.com)
- Icons: inline SVG (no third-party icon library)

---

&copy; 2024 Long Gone — All Spirits Reserved.