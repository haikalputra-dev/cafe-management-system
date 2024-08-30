const express = require('express')
const connection = require('../connection')
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.get('/details', auth.authenticateToken,(req,res)=>{
    var categoryCount;
    var productCount;
    var query = `
        SELECT COUNT(*) as category_count FROM category
    `;
    connection.query(query, (err, results) => {
        if (!err) {
            categoryCount = results[0].category_count;
        } else {
            console.error(err);
            res.status(500).json({ message: "Something went wrong. Please try again later." });
        }
    })

    var query = `
        SELECT COUNT(*) as product_count FROM product
    `;
    connection.query(query, (err, results) => {
        if (!err) {
            productCount = results[0].product_count;
            var data = {
                category: categoryCount,
                product: productCount
            }
            res.status(200).json(data);
        } else {
            console.error(err);
            res.status(500).json({ message: "Something went wrong. Please try again later." });
        }
    })
})

module.exports = router;