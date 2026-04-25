const express = require("express")
const mysql = require("mysql2")
const path = require('path')
const dotenv = require("dotenv")
dotenv.config()

let dbConn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

dbConn.connect(function (err) {
  if (err) throw err;
  console.log(`Connected DB: ${process.env.DB_NAME}`)
})

const app = express()
var cors = require('cors');
app.use(cors());
const router = express.Router()
app.use(router)
router.use(express.json())
router.use(express.urlencoded({ extended: true }))


// ------------------------------------------------------------
// 1. SEARCH SERVICE
//    GET /houses/search?category=&rating=&location=&type=
//    - category : HouseCategory.CategoryName  (optional)
//    - rating   : minimum average rating value (optional)
//    - location : partial match on Area fields (optional)
//    - type     : 'buy' | 'rent'              (optional)
//    Test case 1: GET /houses/search?category=Mansion&location=Bangkok
//    Test case 2: GET /houses/search?rating=4&location=Chiang
//    Test case 3: GET /houses/search?type=rent
// ------------------------------------------------------------
router.get('/houses/search', function (req, res) {
  const { category, rating, location, type } = req.query

  let sql = `
    SELECT
      h.HouseID, h.HouseName,
      h.bedroomCount, h.bathroomCount, h.basementCount,
      h.Description, h.HAreaName,
      h.BuyingStatus, h.RentingStatus,
      h.BuyingPrice, h.RentingPrice,
      hc.CategoryName,
      a.Province, a.District, a.Subdistrict, a.Zipcode,
      AVG(r.RatingValue)            AS avgRating,
      COUNT(DISTINCT r.RCustomerID) AS ratingCount,
      JSON_ARRAYAGG(
        IF(p.PhotoID IS NOT NULL,
           JSON_OBJECT('PhotoID', p.PhotoID, 'PhotoRef', p.PhotoRef, 'Pdescription', p.Pdescription),
           NULL)
      ) AS photos
    FROM House h
    LEFT JOIN HouseCategory hc ON h.HcategoryID = hc.categoryID
    LEFT JOIN Area a           ON h.HAreaName   = a.AreaName
    LEFT JOIN Rating r         ON h.HouseID     = r.RHouseID
    LEFT JOIN Photo p          ON h.HouseID     = p.PHouseID
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

  if (type === 'buy') {
    sql += ` AND h.BuyingStatus = TRUE`
  } else if (type === 'rent') {
    sql += ` AND h.RentingStatus = TRUE`
  }

  sql += `
    GROUP BY
      h.HouseID, h.HouseName, h.bedroomCount, h.bathroomCount,
      h.basementCount, h.Description, h.HAreaName,
      h.BuyingStatus, h.RentingStatus, h.BuyingPrice, h.RentingPrice,
      hc.CategoryName, a.Province, a.District, a.Subdistrict, a.Zipcode
  `

  if (rating) {
    sql += ` HAVING avgRating >= ?`
    params.push(parseFloat(rating))
  }

  dbConn.query(sql, params, function (err, results) {
    if (err) return res.status(500).json({ error: err.message })

    const data = results.map(row => ({
      ...row,
      photos: (row.photos || []).filter(p => p !== null)
    }))

    res.json({ count: data.length, data })
  })
})

// ------------------------------------------------------------
// 2. INSERT HOUSE (Admin only)
//    POST /houses
//    Body: { HouseID, HouseName, bedroomCount, bathroomCount,
//            basementCount, Description, HcategoryID, HAreaName,
//            BuyingStatus, RentingStatus, BuyingPrice, RentingPrice }
//    Test case 1: POST /houses  with all required fields → 201
//    Test case 2: POST /houses  missing HouseID          → 400
// ------------------------------------------------------------
router.post('/houses', function (req, res) {
  const {
    HouseID, HouseName,
    bedroomCount, bathroomCount, basementCount,
    Description, HcategoryID, HAreaName,
    BuyingStatus, RentingStatus,
    BuyingPrice, RentingPrice
  } = req.body

  if (
    !HouseID || !HouseName ||
    bedroomCount === undefined || bathroomCount === undefined || basementCount === undefined ||
    !HcategoryID || !HAreaName ||
    BuyingStatus === undefined || RentingStatus === undefined ||
    BuyingPrice === undefined || RentingPrice === undefined
  ) {
    return res.status(400).json({ error: 'Missing required fields.' })
  }

  const sql = `
    INSERT INTO House
      (HouseID, HouseName, bedroomCount, bathroomCount, basementCount,
       Description, HcategoryID, HAreaName,
       BuyingStatus, RentingStatus, BuyingPrice, RentingPrice)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
  const params = [
    HouseID, HouseName,
    bedroomCount, bathroomCount, basementCount,
    Description || null, HcategoryID, HAreaName,
    BuyingStatus, RentingStatus,
    BuyingPrice, RentingPrice
  ]

  dbConn.query(sql, params, function (err, result) {
    if (err) return res.status(500).json({ error: err.message })
    res.status(201).json({ message: 'House inserted successfully.', HouseID })
  })
})

// ------------------------------------------------------------
// 3. UPDATE HOUSE (Admin only)
//    PUT /houses/:id
//    Body: any subset of { HouseName, bedroomCount, bathroomCount,
//          basementCount, Description, HcategoryID, HAreaName,
//          BuyingStatus, RentingStatus, BuyingPrice, RentingPrice }
//    Test case 1: PUT /houses/H0000000001 { BuyingPrice: 3500000 } → 200
//    Test case 2: PUT /houses/NOTEXIST    { HouseName: "X" }       → 404
// ------------------------------------------------------------
router.put('/houses/:id', function (req, res) {
  const { id } = req.params
  const fields = req.body
  const allowed = [
    'HouseName', 'bedroomCount', 'bathroomCount', 'basementCount',
    'Description', 'HcategoryID', 'HAreaName',
    'BuyingStatus', 'RentingStatus', 'BuyingPrice', 'RentingPrice'
  ]

  const updates = []
  const params = []

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

  dbConn.query(sql, params, function (err, result) {
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
router.delete('/houses/:id', function (req, res) {
  const { id } = req.params

  // First check if house exists
  dbConn.query('SELECT HouseID FROM House WHERE HouseID = ?', [id], function (err, results) {
    if (err) return res.status(500).json({ error: err.message })
    if (results.length === 0)
      return res.status(404).json({ error: `House '${id}' not found.` })

    // Begin transaction — delete all child records first, then the house
    dbConn.beginTransaction(function (err) {
      if (err) return res.status(500).json({ error: err.message })

      const deleteChildren = [
        'DELETE FROM RequestViewing WHERE VHouseID = ?',
        'DELETE FROM Contain       WHERE CHouseID  = ?',
        'DELETE FROM Manage        WHERE MHouseID  = ?',
        'DELETE FROM Rating        WHERE RHouseID  = ?',
        'DELETE FROM Photo         WHERE PHouseID  = ?',
      ]

      // Run each child delete sequentially
      let index = 0
      function next() {
        if (index === deleteChildren.length) {
          // All children deleted — now delete the house
          dbConn.query('DELETE FROM House WHERE HouseID = ?', [id], function (err) {
            if (err) return dbConn.rollback(() =>
              res.status(500).json({ error: err.message }))

            dbConn.commit(function (err) {
              if (err) return dbConn.rollback(() =>
                res.status(500).json({ error: err.message }))

              res.json({ message: 'House deleted successfully.', HouseID: id })
            })
          })
          return
        }

        dbConn.query(deleteChildren[index++], [id], function (err) {
          if (err) return dbConn.rollback(() =>
            res.status(500).json({ error: err.message }))
          next()
        })
      }

      next()
    })
  })
})

// ------------------------------------------------------------
// 5. ADMIN LOGIN
//    POST /admin/login
//    Body: { AdminID, Password }
//    Test case 1: POST /admin/login  correct credentials → 200 + admin info
//    Test case 2: POST /admin/login  wrong password      → 401
// ------------------------------------------------------------
router.post('/admin/login', function (req, res) {
  const { AdminID, Password } = req.body

  if (!AdminID || !Password) {
    return res.status(400).json({ error: 'AdminID and Password are required.' })
  }

  const sql = `SELECT AdminID, Aname, AdminGmail, AdminPhoneNumber, Salary, Password
               FROM Admin WHERE AdminID = ?`

  dbConn.query(sql, [AdminID], function (err, results) {
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

// ------------------------------------------------------------
// 6. GET ALL HOUSES
//    GET /houses
//    - Returns all houses with category name, area info,
//      avg rating, and photos
//    Test case 1: GET /houses            → 200 + array of all houses
//    Test case 2: GET /houses (empty DB) → 200 + empty array
// ------------------------------------------------------------
router.get('/houses', function (req, res) {
  const sql = `
    SELECT
      h.HouseID,
      h.HouseName,
      h.bedroomCount,
      h.bathroomCount,
      h.basementCount,
      h.Description,
      h.HAreaName,
      h.BuyingStatus,
      h.RentingStatus,
      h.BuyingPrice,
      h.RentingPrice,
      hc.CategoryName,
      a.Province,
      a.District,
      a.Subdistrict,
      a.Zipcode,
      AVG(r.RatingValue)            AS avgRating,
      COUNT(DISTINCT r.RCustomerID) AS ratingCount,
      JSON_ARRAYAGG(
        IF(p.PhotoID IS NOT NULL,
           JSON_OBJECT('PhotoID', p.PhotoID, 'PhotoRef', p.PhotoRef, 'Pdescription', p.Pdescription),
           NULL)
      ) AS photos
    FROM House h
    LEFT JOIN HouseCategory hc ON h.HcategoryID = hc.categoryID
    LEFT JOIN Area a           ON h.HAreaName   = a.AreaName
    LEFT JOIN Rating r         ON h.HouseID     = r.RHouseID
    LEFT JOIN Photo p          ON h.HouseID     = p.PHouseID
    GROUP BY
      h.HouseID, h.HouseName, h.bedroomCount, h.bathroomCount,
      h.basementCount, h.Description, h.HAreaName,
      h.BuyingStatus, h.RentingStatus, h.BuyingPrice, h.RentingPrice,
      hc.CategoryName, a.Province, a.District, a.Subdistrict, a.Zipcode
    ORDER BY h.HouseID
  `

  dbConn.query(sql, function (err, results) {
    if (err) return res.status(500).json({ error: err.message })

    // Clean up photos: remove nulls from JSON_ARRAYAGG
    const data = results.map(row => ({
      ...row,
      photos: (row.photos || []).filter(p => p !== null)
    }))

    res.json({ count: data.length, data })
  })
})

// ------------------------------------------------------------
// 7. GET HOUSE BY ID
//    GET /houses/:id
//    Test case 1: GET /houses/H0000000001  → 200 + house data
//    Test case 2: GET /houses/NOTEXIST     → 404
// ------------------------------------------------------------
router.get('/houses/:id', function (req, res) {
  const { id } = req.params

  const sql = `
    SELECT
      h.HouseID,
      h.HouseName,
      h.bedroomCount,
      h.bathroomCount,
      h.basementCount,
      h.Description,
      h.HAreaName,
      h.BuyingStatus,
      h.RentingStatus,
      h.BuyingPrice,
      h.RentingPrice,
      hc.CategoryName,
      a.Province,
      a.District,
      a.Subdistrict,
      a.Zipcode,
      AVG(r.RatingValue)            AS avgRating,
      COUNT(DISTINCT r.RCustomerID) AS ratingCount,
      JSON_ARRAYAGG(
        IF(p.PhotoID IS NOT NULL,
           JSON_OBJECT('PhotoID', p.PhotoID, 'PhotoRef', p.PhotoRef, 'Pdescription', p.Pdescription),
           NULL)
      ) AS photos
    FROM House h
    LEFT JOIN HouseCategory hc ON h.HcategoryID = hc.categoryID
    LEFT JOIN Area a           ON h.HAreaName   = a.AreaName
    LEFT JOIN Rating r         ON h.HouseID     = r.RHouseID
    LEFT JOIN Photo p          ON h.HouseID     = p.PHouseID
    WHERE h.HouseID = ?
    GROUP BY
      h.HouseID, h.HouseName, h.bedroomCount, h.bathroomCount,
      h.basementCount, h.Description, h.HAreaName,
      h.BuyingStatus, h.RentingStatus, h.BuyingPrice, h.RentingPrice,
      hc.CategoryName, a.Province, a.District, a.Subdistrict, a.Zipcode
  `

  dbConn.query(sql, [id], function (err, results) {
    if (err) return res.status(500).json({ error: err.message })
    if (results.length === 0)
      return res.status(404).json({ error: `House '${id}' not found.` })

    const house = {
      ...results[0],
      photos: (results[0].photos || []).filter(p => p !== null)
    }

    res.json({ data: house })
  })
})

app.listen(process.env.PORT, function () {
  console.log(`Server listening on port: ${process.env.PORT}`)
})
