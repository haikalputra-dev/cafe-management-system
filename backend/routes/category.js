const express = require('express')
const connection = require('../connection')
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let category = req.body
    var query = "INSERT INTO category (category_name) VALUES (?)"
    connection.query(query, [category.category_name], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Category added successfully" });
        } else {
            console.error(err);
            return res.status(500).json({ message: "Something went wrong. Please try again later." });
        }
    })
})

router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    var query = "SELECT * FROM category ORDER BY category_name"
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            console.error(err);
            return res.status(500).json({ message: "Something went wrong. Please try again later." });
        }
    })
})

router.patch('/update',auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let category = req.body
    var query = "UPDATE category SET category_name =? WHERE id =?"
    connection.query(query, [category.category_name, category.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({message: "Category ID Not Found"});
            }
            return res.status(200).json({ message: "Category updated successfully" });
        } else {
            console.error(err);
            return res.status(500).json({ message: "Something went wrong. Please try again later." });
        }
    })
})

module.exports = router;