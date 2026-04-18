const express = require('express');
const dotenv = require("dotenv");
const path = require('path')
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT;
dotenv.config();


var connection = mysql.createConnection({
 host : process.env.DB_HOST,
 user : process.env.DB_USER,
 password : process.env.DB_PASSWORD,
 database : process.env.DB_NAME
});

connection.connect(function(err){
 if(err) throw err;
 console.log(`Connected DB: ${process.env.DB_NAME}`);
});


const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
app.use(router)

//Select all
router.get('/students', function (req, res) {
    connection.query('SELECT * FROM personal_info', function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Student list.' });
    });
});

//Select
router.get('/student/:id', function (req, res) {
let student_id = req.params.id;
if (!student_id) {
return res.status(400).send({ error: true, message: 'Please provide student id.' });
}
connection.query('SELECT * FROM personal_info where StudentID = ?', student_id, function (error, results) {
if (error) throw error;
return res.send({ error: false, data: results[0], message: 'Student retrieved' });
});
});

//Delete
router.delete('/student', function (req, res) {
    let student_id = req.body.StudentID;
    if (!student_id) {
        return res.status(400).send({ error: true, message: 'Please provide student_id' });
    }
    connection.query('DELETE FROM personal_info WHERE StudentID = ?', [student_id], function (error, results){
        if (error) throw error;
        return res.send({ error: false, data: results.affectedRows, message: 'Student has been deleted successfully.' });
    });
});

//INSERT
router.post('/student', function (req, res) {
    let student = req.body;
    console.log(student);
    if (!student) {
        return res.status(400).send({ error: true, message: 'Please provide student information' });
    }
connection.query("INSERT INTO personal_info SET ? ", student, function (error, results) {
    if (error) throw error;
    return res.send({error: false, data: results.affectedRows, message: 'New student has been created successfully.'});
    });
});

//UPDATE
router.put('/student', function (req, res) {
    let student_id = req.body.StudentID;
    let student = req.body;
    if (!student_id || !student) {
        return res.status(400).send({ error: student, message: 'Please provide student information' });
    }
    connection.query("UPDATE personal_info SET ? WHERE StudentID = ?", [student, student_id], function (error, results) {
    if (error) throw error;
    return res.send({error: false, data: results.affectedRows, message: 'Student has been updated successfully.'})
    });
});

// Server listening
app.listen(process.env.PORT, function () {
 console.log("Server listening at Port " + process.env.PORT);});