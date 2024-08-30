const express = require("express");
const connection = require("../connection");
var auth = require('../services/authentication');
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

const router = express.Router();

router.post('/insertBill', auth.authenticateToken, (req, res) => {
  try {
    const generatedUUID = uuid.v1();
    const orderDetails = req.body;

    let productDetailsReport;
    try {
      if (!orderDetails.product_details) {
        return res.status(400).json({ error: "Product details are required" });
      }
      productDetailsReport = JSON.parse(orderDetails.product_details);
    } catch (parseError) {
      return res.status(400).json({ error: "Invalid JSON format in product_details" });
    }

    const query =
      "INSERT INTO bill (bill_name, uuid, email, contact_number, payment_method, total, product_details, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    connection.query(
      query,
      [
        orderDetails.bill_name,
        generatedUUID,
        orderDetails.email,
        orderDetails.contact_number,
        orderDetails.payment_method,
        orderDetails.total, // Make sure this field is named correctly
        orderDetails.product_details, // Ensure this is correctly stored
        res.locals.email,
      ],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        } else {
          return res.status(200).json({ uuid: generatedUUID, product_details: productDetailsReport });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/getPDF", auth.authenticateToken, (req, res) => {
  const orderDetails = req.body;
  const pdfPath = "../generated_PDF/" + orderDetails.uuid + ".pdf";
  if (fs.existsSync(pdfPath)) {
    res.contentType("application/pdf");
    fs.createReadStream(pdfPath).pipe(res);
  } else {
    let productDetailsReport = JSON.parse(orderDetails.productDetails);
    ejs.renderFile(
      path.join(__dirname, "", "report.ejs"),
      {
        productDetails: productDetailsReport,
        name: orderDetails.name,
        email: orderDetails.email,
        contactNumber: orderDetails.contactNumber,
        paymentMethod: orderDetails.paymentMethod,
        totalAmount: orderDetails.totalAmount,
      },
      (err, results) => {
        if (err) {
          return res.status(200).json({ err });
        } else {
          pdf
            .create(results)
            .toFile(
              "./generated_PDF/" + orderDetails.uuid + ".pdf",
              (err, data) => {
                if (err) {
                  console.log(err);
                  return res.status(500).json({ err });
                } else {
                  res.contentType("application/pdf");
                  fs.createReadStream(pdfPath).pipe(res);
                }
              }
            );
        }
      }
    );
  }
});

router.get("/getBills", auth.authenticateToken, (req, res, next) => {
  let query = "select * from bill order by id DESC";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({ data: results });
    } else {
      return res.status(500).json({ err });
    }
  });
});

router.delete("/delete/:id", auth.authenticateToken, (req, res, next) => {
  const id = req.params.id;
  let query = "delete from bill where id=?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({ message: "Bill ID not found" });
      }
      return res.status(200).json({ message: "Bill deleted successfully" });
    } else {
      return res.status(500).json({ err });
    }
  });
});

module.exports = router;
