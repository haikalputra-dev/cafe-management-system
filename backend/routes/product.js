const express = require('express')
const connection = require('../connection')
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add', auth.authenticateToken, checkRole.checkRole, async (req, res) => {
    let product = req.body;
    var query = "INSERT INTO product (product_name,category_id,description,price,status) VALUES(?,?,?,?,'true')";
    connection.query(query, [product.product_name, product.category_id, product.description, product.price], async (err, results) => {
        if (!err) {
            return res.status(201).json({ message: "Product added successfully" });
        } else {
            console.error(err);
            return res.status(500).json({ message: "Something went wrong. Please try again later." });
        }
    })
})

router.get('/get', auth.authenticateToken, async (req, res, next) => {
    var query = `
        SELECT
            p.id, p.product_name, p.description, p.price,p.status,c.id as category_id, c.category_name 
        FROM 
            product as p 
        INNER JOIN
            category AS c ON p.category_id = c.id
    `;
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            console.error(err);
            return res.status(500).json(err);
        }
    })
})

router.get('/getByCategory/:id', auth.authenticateToken,(req, res)=>{
    const id = req.params.id;
    var query = `
        SELECT 
            id,product_name
        FROM
            product
        WHERE
            category_id= ? AND status= 'true'
    `;
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            console.error(err);
            return res.status(500).json(err);
        }
    })
})

router.get('/getById/:id',auth.authenticateToken,(req, res) => {
    const id = req.params.id;
    var query = `
        SELECT
            id, product_name, description, price
        FROM
            product
        WHERE
            id =?
    `;
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results[0]);
        } else {
            console.error(err);
            return res.status(500).json(err);
        }
    })
})

router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body;
    var query = "UPDATE product SET product_name=?, category_id=?, description=?, price=? WHERE id=?";
    connection.query(query, [product.product_name,product.category_id, product.description, product.price, product.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Product ID Not Found" });
            }
            return res.status(200).json({ message: "Product updated successfully" });
        } else {
            console.error(err);
            return res.status(500).json({ message: "Something went wrong. Please try again later." });
        }
    })
})

router.delete('/delete/:id',auth.authenticateToken,checkRole.checkRole,(req, res,next) => {
    const id = req.params.id;
    var query = "DELETE FROM product WHERE id=?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Product ID Not Found" });
            }
            return res.status(200).json({ message: "Product deleted successfully" });
        } else {
            console.error(err);
            return res.status(500).json({ message: "Something went wrong. Please try again later." });
        }
    })
});

router.patch('/updateStatus', auth.authenticateToken, checkRole.checkRole,(req, res) => {
    let product = req.body;
    var query = "UPDATE product SET status=? WHERE id=?";
    connection.query(query, [product.status, product.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Product ID Not Found" });
            }
            return res.status(200).json({ message: "Product status updated successfully" });
        } else {
            console.error(err);
            return res.status(500).json({ message: "Something went wrong. Please try again later." });
        }
    })
});

module.exports = router;