// ═══════════════════════════════════════════════════════════════
//  LONG GONE — SHARED DATA STORE  (localStorage persistence)
// ═══════════════════════════════════════════════════════════════
var LG = (function () {
    var KEY = 'lgHouses';

    // Seed data — at least 10 records
    var DEFAULTS = [
        { id: 67, name: "Haunted House in the Middle of Salaya", city: "Bangkok", area: "Salaya, Nakhon Pathom", location: "Salaya, Phutthamonthon, Nakhon Pathom, 73170", price: "500,000", type: "rent", rating: 4, bedrooms: 1, bathrooms: 1, basement: 1, updated: "16/2/2026", email: "haunted67@longgone.th", phone: "014-254-785", desc: "A historic Victorian-era estate nestled deep within misty Salaya forests. Original hardwood floors, gothic archways, and a sprawling garden of overgrown stone paths.", card: "https://picsum.photos/seed/ghost1/400/300", imgs: ["https://picsum.photos/seed/ghost1/900/600", "https://picsum.photos/seed/dark7/900/600", "https://picsum.photos/seed/manor1/900/600"] },
        { id: 68, name: "Old Victorian Manor", city: "Bangkok", area: "Nongkhok, 10530", location: "Nongkhok, Min Buri, Bangkok, 10530", price: "800,000", type: "buy", rating: 5, bedrooms: 3, bathrooms: 2, basement: 1, updated: "10/3/2026", email: "manor68@longgone.th", phone: "012-345-678", desc: "Grand Victorian manor with original stained glass and ornate plasterwork. Three stories of creaking floorboards and hidden passages. Vacant since 1987 after the previous owner mysteriously vanished.", card: "https://picsum.photos/seed/manor2/400/300", imgs: ["https://picsum.photos/seed/manor2/900/600", "https://picsum.photos/seed/ghost4/900/600", "https://picsum.photos/seed/dark3/900/600"] },
        { id: 69, name: "The Whisper House", city: "Chiang Mai", area: "Chiang Mai, 50000", location: "Mueang, Chiang Mai, 50000", price: "300,000", type: "rent", rating: 3, bedrooms: 2, bathrooms: 1, basement: 0, updated: "5/4/2026", email: "whisper69@longgone.th", phone: "053-123-456", desc: "A quaint wooden cottage known for strange whispering sounds that emanate from its walls on full moon nights. The structure dates back to the early 1900s.", card: "https://picsum.photos/seed/spooky3/400/300", imgs: ["https://picsum.photos/seed/spooky3/900/600", "https://picsum.photos/seed/ghost5/900/600", "https://picsum.photos/seed/manor3/900/600"] },
        { id: 70, name: "The Crow Estate", city: "Bangkok", area: "Nongkhok, 10530", location: "Nongkhok, Min Buri, Bangkok, 10530", price: "650,000", type: "buy", rating: 4, bedrooms: 2, bathrooms: 2, basement: 1, updated: "2/4/2026", email: "crow70@longgone.th", phone: "014-789-012", desc: "A secluded estate shrouded in century-old banyan trees, notorious for unexplained phenomena. The property includes a private cemetery from the original landowners.", card: "https://picsum.photos/seed/dark4/400/300", imgs: ["https://picsum.photos/seed/dark4/900/600", "https://picsum.photos/seed/spooky6/900/600", "https://picsum.photos/seed/ghost1/900/600"] },
        { id: 71, name: "The Mist Manor", city: "Chiang Rai", area: "Chiang Rai, 57000", location: "Mueang, Chiang Rai, 57000", price: "420,000", type: "rent", rating: 5, bedrooms: 2, bathrooms: 1, basement: 0, updated: "1/4/2026", email: "mist71@longgone.th", phone: "053-987-654", desc: "Perched on a hillside forever shrouded in morning mist. The previous tenants left all belongings behind — their whereabouts remain unknown.", card: "https://picsum.photos/seed/manor5/400/300", imgs: ["https://picsum.photos/seed/manor5/900/600", "https://picsum.photos/seed/dark2/900/600", "https://picsum.photos/seed/ghost3/900/600"] },
        { id: 72, name: "Shadowfall Cottage", city: "Phuket", area: "Kathu, Phuket", location: "Kathu, Phuket, 83120", price: "350,000", type: "rent", rating: 4, bedrooms: 1, bathrooms: 1, basement: 1, updated: "28/3/2026", email: "shadow72@longgone.th", phone: "076-123-456", desc: "A colonial-era bungalow hidden among rubber trees. Guests report hearing old gramophone music late at night.", card: "https://picsum.photos/seed/ghost6/400/300", imgs: ["https://picsum.photos/seed/ghost6/900/600", "https://picsum.photos/seed/manor4/900/600", "https://picsum.photos/seed/spooky2/900/600"] },
        { id: 73, name: "The Hollow Keep", city: "Ayutthaya", area: "Ayutthaya, 13000", location: "Phra Nakhon Si Ayutthaya, Ayutthaya, 13000", price: "750,000", type: "buy", rating: 5, bedrooms: 4, bathrooms: 3, basement: 2, updated: "15/3/2026", email: "hollow73@longgone.th", phone: "035-123-456", desc: "Built on ruins of a 17th century fort. The basement rooms are rumored to connect to ancient underground passages.", card: "https://picsum.photos/seed/dark7/400/300", imgs: ["https://picsum.photos/seed/dark7/900/600", "https://picsum.photos/seed/ghost2/900/600", "https://picsum.photos/seed/manor6/900/600"] },
        { id: 74, name: "Widow's Peak House", city: "Chiang Mai", area: "Doi Saket, Chiang Mai", location: "Doi Saket, Chiang Mai, 50220", price: "280,000", type: "rent", rating: 3, bedrooms: 2, bathrooms: 1, basement: 0, updated: "10/3/2026", email: "widow74@longgone.th", phone: "053-456-789", desc: "Perched atop a rocky hill. The original owner's rocking chair still moves on windless nights.", card: "https://picsum.photos/seed/spooky8/400/300", imgs: ["https://picsum.photos/seed/spooky8/900/600", "https://picsum.photos/seed/manor7/900/600", "https://picsum.photos/seed/dark5/900/600"] }
    ];

    function load() {
        try {
            var r = localStorage.getItem(KEY);
            if (r) return JSON.parse(r);
        } catch (e) {}
        save(DEFAULTS);
        return JSON.parse(JSON.stringify(DEFAULTS));
    }

    function save(arr) {
        try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) {}
    }

    function today() {
        var d = new Date();
        return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    }

    function getAll() { return load(); }

    function getById(id) {
        return load().find(function (h) { return h.id === parseInt(id); }) || null;
    }

    function update(id, patch) {
        var arr = load();
        var i = arr.findIndex(function (h) { return h.id === parseInt(id); });
        if (i === -1) return false;
        Object.keys(patch).forEach(function (k) { arr[i][k] = patch[k]; });
        arr[i].updated = today();
        save(arr);
        return true;
    }

    function add(house) {
        var arr = load();
        var maxId = arr.reduce(function (m, h) { return Math.max(m, h.id); }, 0);
        house.id = (house.id && !arr.find(function (h) { return h.id === parseInt(house.id); })) ? parseInt(house.id) : maxId + 1;
        house.updated = today();
        house.card = house.card || 'https://picsum.photos/seed/new' + house.id + '/400/300';
        house.imgs = house.imgs || ['https://picsum.photos/seed/new' + house.id + '/900/600', 'https://picsum.photos/seed/new' + house.id + 'b/900/600', 'https://picsum.photos/seed/new' + house.id + 'c/900/600'];
        house.rating = house.rating || 3;
        house.bedrooms = house.bedrooms || 1;
        house.bathrooms = house.bathrooms || 1;
        house.basement = house.basement || 0;
        house.email = house.email || 'info@longgone.th';
        house.phone = house.phone || '—';
        house.desc = house.desc || 'A mysterious haunted property awaiting its next resident.';
        arr.push(house);
        save(arr);
        return house;
    }

    function remove(id) {
        save(load().filter(function (h) { return h.id !== parseInt(id); }));
    }

    function reset() { localStorage.removeItem(KEY); }

    return { getAll: getAll, getById: getById, update: update, add: add, remove: remove, reset: reset };
})();

// ═══════════════════════════════════════════════════════════════
//  ADMIN AUTH HELPERS
// ═══════════════════════════════════════════════════════════════
function isAdmin() {
    if (localStorage.getItem('lgAdmin') === 'true') {
        sessionStorage.setItem('lgAdmin', 'true');
        sessionStorage.setItem('lgAdminUser', localStorage.getItem('lgAdminUser') || 'Admin');
    }
    return sessionStorage.getItem('lgAdmin') === 'true';
}

function getAdminUser() {
    return sessionStorage.getItem('lgAdminUser') || localStorage.getItem('lgAdminUser') || 'Admin';
}

function doLogout() {
    sessionStorage.removeItem('lgAdmin');
    localStorage.removeItem('lgAdmin');
    sessionStorage.removeItem('lgAdminUser');
    localStorage.removeItem('lgAdminUser');
    location.href = 'admin-login.html';
}

// ═══════════════════════════════════════════════════════════════
//  COMMON UI UTILITIES
// ═══════════════════════════════════════════════════════════════
function showToast(msg, color) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    var t = document.createElement('div');
    t.className = 'toast';
    t.style.background = color || '#2e9e5e';
    t.innerHTML = msg;
    document.body.appendChild(t);
    setTimeout(function() {
        t.style.opacity = '0';
        t.style.transform = 'translateY(20px)';
        t.style.transition = 'all .3s';
    }, 2200);
    setTimeout(function() {
        t.remove();
    }, 2600);
}

function updateNavAdmin() {
    var btn = document.getElementById('adminBtn');
    var ind = document.getElementById('adminIndicator');
    if (!btn && !ind) return;
    if (isAdmin()) {
        var user = sessionStorage.getItem('lgAdminUser') || localStorage.getItem('lgAdminUser') || 'Admin';
        if (btn) {
            btn.textContent = 'Dashboard';
            btn.onclick = function() { location.href = 'dashboard.html'; };
        }
        if (ind) {
            ind.style.display = 'inline';
            ind.innerHTML = '&#128274; ' + user;
        }
    } else {
        if (btn) {
            btn.onclick = function() { location.href = 'admin-login.html'; };
        }
        if (ind) {
            ind.style.display = 'none';
        }
    }
}

// Run nav admin update on DOM load
document.addEventListener('DOMContentLoaded', updateNavAdmin);

