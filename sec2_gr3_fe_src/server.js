// Declarations
const express = require('express');
const path    = require('path');
const port    = 5000;
const app     = express();

// Serve static assets (script.js, images/, html/*.css)
app.use(express.static(path.join(__dirname)));

const router  = express.Router();
app.use(router);

// Handle POST method form
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


// ── Public Routes ──────────────────────────────────────────────────────────

// Homepage
router.get('/', (req, res) => {
    console.log('Request at ' + req.url);
    res.sendFile(path.join(`${__dirname}/html/homepage.html`));
});

// Buy Page
router.get('/buy', (req, res) => {
    console.log('Request at ' + req.url);
    res.sendFile(path.join(`${__dirname}/html/buy.html`));
});

// Rent Page
router.get('/rent', (req, res) => {
    console.log('Request at ' + req.url);
    res.sendFile(path.join(`${__dirname}/html/rent.html`));
});

// Team Page
router.get('/team', (req, res) => {
    console.log('Request at ' + req.url);
    res.sendFile(path.join(`${__dirname}/html/team.html`));
});

// House Detail Page
router.get('/house', (req, res) => {
    console.log('Request at ' + req.url);
    res.sendFile(path.join(`${__dirname}/html/house-detail.html`));
});

// Search Result Page
router.get('/search', (req, res) => {
    console.log('Request at ' + req.url);
    res.sendFile(path.join(`${__dirname}/html/search-result.html`));
});

// Success Page
router.get('/success', (req, res) => {
    console.log('Request at ' + req.url);
    res.sendFile(path.join(`${__dirname}/html/success.html`));
});


// ── Admin Routes ───────────────────────────────────────────────────────────

// Admin Login Page
router.get('/admin/login', (req, res) => {
    console.log('Request at ' + req.url);
    res.sendFile(path.join(`${__dirname}/html/admin-login.html`));
});

// Admin Dashboard Page
router.get('/admin/dashboard', (req, res) => {
    console.log('Request at ' + req.url);
    res.sendFile(path.join(`${__dirname}/html/dashboard.html`));
});

// Add House Page
router.get('/admin/add', (req, res) => {
    console.log('Request at ' + req.url);
    res.sendFile(path.join(`${__dirname}/html/add-house.html`));
});

// Edit House Page
router.get('/admin/edit', (req, res) => {
    console.log('Request at ' + req.url);
    res.sendFile(path.join(`${__dirname}/html/edit-house.html`));
});

// Edit Name Page
router.get('/admin/edit/name', (req, res) => {
    console.log('Request at ' + req.url);
    res.sendFile(path.join(`${__dirname}/html/edit-name.html`));
});

// Edit Price Page
router.get('/admin/edit/price', (req, res) => {
    console.log('Request at ' + req.url);
    res.sendFile(path.join(`${__dirname}/html/edit-price.html`));
});

// Edit Image Page
router.get('/admin/edit/image', (req, res) => {
    console.log('Request at ' + req.url);
    res.sendFile(path.join(`${__dirname}/html/edit-image.html`));
});


// ── Error Page ─────────────────────────────────────────────────────────────

router.use((req, res, next) => {
    console.log('Request at ' + req.url);
    console.log('404: Page not found');
    res.status(404).send('404: Page not found');
});


// ── Binding Port ───────────────────────────────────────────────────────────

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
