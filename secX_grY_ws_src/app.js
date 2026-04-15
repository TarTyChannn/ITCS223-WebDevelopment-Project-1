const express = require("express")
const mysql = require("mysql2")
const path = require('path')
const dotenv = require("dotenv")
dotenv.config()

let dbConn = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

dbConn.connect(function(err){
  if(err) throw err;
  console.log(`Connected DB: ${process.env.DB_NAME}`)
})

const app = express()
var cors = require('cors');
app.use(cors());
const router = express.Router()
app.use(router)
router.use(express.json())
router.use(express.urlencoded({extended: true}))

// ============================================================
// code here
// ============================================================

// ------------------------------------------------------------
// 1. SEARCH SERVICE
//    GET /houses/search?category=&rating=&location=
//    - category : HouseCategory.CategoryName  (optional)
//    - rating   : minimum average rating value (optional)
//    - location : partial match on Area fields  (optional)
//    Test case 1: GET /houses/search?category=Mansion&location=Bangkok
//    Test case 2: GET /houses/search?rating=4&location=Chiang
// ------------------------------------------------------------
router.get('/houses/search', function(req, res) {
  const { category, rating, location } = req.query

  let sql = `
    SELECT
      h.HouseID, h.HouseName, h.HousePrice,
      h.bedroomCount, h.bathroomCount, h.basementCount,
      h.Description, h.HAreaName,
      hc.CategoryName,
      AVG(r.RatingValue) AS avgRating
    FROM House h
    LEFT JOIN HouseCategory hc ON h.HcategoryID = hc.categoryID
    LEFT JOIN Area a           ON h.HAreaName   = a.AreaName
    LEFT JOIN Rating r         ON h.HouseID     = r.RHouseID
    WHERE 1=1
  `
  const params = []

  if (category) {
    sql += ` AND hc.CategoryName = ?`
    params.push(category)
  }

  if (location) {
    sql += ` AND (
      a.AreaName    LIKE ? OR
      a.Province    LIKE ? OR
      a.District    LIKE ? OR
      a.Subdistrict LIKE ? OR
      a.Zipcode     LIKE ?
    )`
    const like = `%${location}%`
    params.push(like, like, like, like, like)
  }

  sql += ` GROUP BY h.HouseID`

  if (rating) {
    sql += ` HAVING avgRating >= ?`
    params.push(parseFloat(rating))
  }

  dbConn.query(sql, params, function(err, results) {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ count: results.length, data: results })
  })
})

// ------------------------------------------------------------
// 2. INSERT HOUSE (Admin only)
//    POST /houses
//    Body: { HouseID, HouseName, HousePrice, bedroomCount,
//            bathroomCount, basementCount, Description,
//            HcategoryID, HAreaName }
//    Test case 1: POST /houses  with all required fields → 201
//    Test case 2: POST /houses  missing HouseID          → 400
// ------------------------------------------------------------
router.post('/houses', function(req, res) {
  const {
    HouseID, HouseName, HousePrice,
    bedroomCount, bathroomCount, basementCount,
    Description, HcategoryID, HAreaName
  } = req.body

  if (!HouseID || !HouseName || HousePrice === undefined ||
      bedroomCount === undefined || bathroomCount === undefined ||
      basementCount === undefined || !HcategoryID || !HAreaName) {
    return res.status(400).json({ error: 'Missing required fields.' })
  }

  const sql = `
    INSERT INTO House
      (HouseID, HouseName, HousePrice, bedroomCount, bathroomCount,
       basementCount, Description, HcategoryID, HAreaName)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
  const params = [
    HouseID, HouseName, HousePrice,
    bedroomCount, bathroomCount, basementCount,
    Description || null, HcategoryID, HAreaName
  ]

  dbConn.query(sql, params, function(err, result) {
    if (err) return res.status(500).json({ error: err.message })
    res.status(201).json({ message: 'House inserted successfully.', HouseID })
  })
})

// ------------------------------------------------------------
// 3. UPDATE HOUSE (Admin only)
//    PUT /houses/:id
//    Body: any subset of { HouseName, HousePrice, bedroomCount,
//          bathroomCount, basementCount, Description,
//          HcategoryID, HAreaName }
//    Test case 1: PUT /houses/H0000000001 { HousePrice: 3500000 } → 200
//    Test case 2: PUT /houses/NOTEXIST    { HouseName: "X" }      → 404
// ------------------------------------------------------------
router.put('/houses/:id', function(req, res) {
  const { id } = req.params
  const fields = req.body
  const allowed = [
    'HouseName','HousePrice','bedroomCount','bathroomCount',
    'basementCount','Description','HcategoryID','HAreaName'
  ]

  const updates = []
  const params  = []

  allowed.forEach(field => {
    if (fields[field] !== undefined) {
      updates.push(`${field} = ?`)
      params.push(fields[field])
    }
  })

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No valid fields provided for update.' })
  }

  params.push(id)
  const sql = `UPDATE House SET ${updates.join(', ')} WHERE HouseID = ?`

  dbConn.query(sql, params, function(err, result) {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0)
      return res.status(404).json({ error: `House '${id}' not found.` })
    res.json({ message: 'House updated successfully.', HouseID: id })
  })
})

// ------------------------------------------------------------
// 4. DELETE HOUSE (Admin only)
//    DELETE /houses/:id
//    Test case 1: DELETE /houses/H0000000001  → 200
//    Test case 2: DELETE /houses/NOTEXIST     → 404
// ------------------------------------------------------------
router.delete('/houses/:id', function(req, res) {
  const { id } = req.params

  dbConn.query('DELETE FROM House WHERE HouseID = ?', [id], function(err, result) {
    if (err) return res.status(500).json({ error: err.message })
    if (result.affectedRows === 0)
      return res.status(404).json({ error: `House '${id}' not found.` })
    res.json({ message: 'House deleted successfully.', HouseID: id })
  })
})

// ------------------------------------------------------------
// 5. ADMIN REGISTER
//    POST /admin/register
//    Body: { AdminID, Aname, AdminGmail, AdminPhoneNumber, Salary, Password }
//    Test case 1: POST /admin/register with all fields          → 201
//    Test case 2: POST /admin/register with duplicate AdminID   → 409
// ------------------------------------------------------------
router.post('/admin/register', function(req, res) {
  const { AdminID, Aname, AdminGmail, AdminPhoneNumber, Salary, Password } = req.body

  if (!AdminID || !Aname || !AdminGmail || !AdminPhoneNumber || !Salary || !Password) {
    return res.status(400).json({ error: 'Missing required fields.' })
  }

  const sql = `
    INSERT INTO Admin (AdminID, Aname, AdminGmail, AdminPhoneNumber, Salary, Password)
    VALUES (?, ?, ?, ?, ?, ?)
  `
  dbConn.query(sql, [AdminID, Aname, AdminGmail, AdminPhoneNumber, Salary, Password], function(err, result) {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY')
        return res.status(409).json({ error: `AdminID '${AdminID}' already exists.` })
      return res.status(500).json({ error: err.message })
    }
    res.status(201).json({ message: 'Admin registered successfully.', AdminID })
  })
})

// ------------------------------------------------------------
// 6. ADMIN LOGIN
//    POST /admin/login
//    Body: { AdminID, Password }
//    Test case 1: POST /admin/login  correct credentials        → 200 + admin info
//    Test case 2: POST /admin/login  wrong password             → 401
// ------------------------------------------------------------
router.post('/admin/login', function(req, res) {
  const { AdminID, Password } = req.body

  if (!AdminID || !Password) {
    return res.status(400).json({ error: 'AdminID and Password are required.' })
  }

  const sql = `SELECT AdminID, Aname, AdminGmail, AdminPhoneNumber, Salary, Password
               FROM Admin WHERE AdminID = ?`

  dbConn.query(sql, [AdminID], function(err, results) {
    if (err) return res.status(500).json({ error: err.message })

    if (results.length === 0)
      return res.status(401).json({ error: 'Invalid AdminID or password.' })

    const admin = results[0]

    if (Password !== admin.Password)
      return res.status(401).json({ error: 'Invalid AdminID or password.' })

    // Return admin info (exclude password)
    const { Password: _, ...adminInfo } = admin
    res.json({ message: 'Login successful.', admin: adminInfo })
  })
})

// ============================================================
// end code here
// ============================================================

app.listen(process.env.PORT, function(){
  console.log(`Server listening on port: ${process.env.PORT}`)
})