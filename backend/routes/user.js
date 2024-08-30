const express = require('express');
const connection = require('../connection');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/signup', async (req, res) => {
    let user = req.body;
    let query = "SELECT email FROM user WHERE email=?"
    connection.query(query, [user.email], async (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                //hash the password
                const hashedPassword = await bcrypt.hash(user.password, 10);

                let query = "INSERT INTO user (name,contactNumber,email,password,status,role) VALUES(?,?,?,?,'false','user')";
                connection.query(query, [user.name, user.contactNumber, user.email, hashedPassword], (err, results) => {
                    if (!err) {
                        return res.status(200).json({
                            message: "Successfully Registered"
                        });
                    } else {
                        console.error(err); // Log error for debugging
                        return res.status(500).json({
                            error: "Database error during registration"
                        });
                    }
                })
            } else {
                return res.status(400).json({
                    message: "Email Already Exist"
                });
            }
        } else {
            return res.status(500).json(err);
        }
    })
})

router.post('/login', async (req, res) => {
    const user = req.body;
    let query = "SELECT * FROM user where EMAIL=?";
    connection.query(query, [user.email], async (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(401).json({
                    message: "Incorrect Username or Password"
                });
            } else {
                const hashedPassword = results[0].password;
                // Use bcrypt to compare the provided password with the stored hash
                bcrypt.compare(user.password, hashedPassword, (err, isMatch) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Something Went Wrong. Please Try Again Later"
                        });
                    }

                    if (!isMatch) {
                        return res.status(401).json({
                            message: "Incorrect Username or Password"
                        });
                    } else if (results[0].status === "false") {
                        return res.status(401).json({
                            message: "Account not activated"
                        });
                    } else {
                        const response = {
                            id: results[0].id,  
                            name: results[0].name,
                            contactNumber: results[0].contactNumber,
                            email: results[0].email,
                            role: results[0].role
                        }
                        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
                            expiresIn: '8h'
                        })
                        // Password matches and account is activated
                        const welcomeMessage = `Login successful, Welcome ${response.name}`;
                        return res.status(200).json({
                            token: accessToken,
                            message: welcomeMessage
                        });
                    }
                });
            }
        } else {
            return res.status(500).json(err);
        }
    })
})

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // or 587 if 465 is blocked
    secure: false, // true for 465, false for 587
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

router.post('/forgotPassword', async (req, res) => {
    const user = req.body;
    query = "SELECT email,password,name FROM user WHERE email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(200).json({ message: "Check your email" });
            }
            else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: "Password Reset - Alaska Cafe",
                    html: `<p><b>PASSWORD RESET<br>Your Email : ${results[0].email}<br>Your Name : ${results[0].name}</br><br><a href="http://localhost:8080/"> Click Here to Reset Your Password </a></p>`
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email Sent : ' + info.response);
                    }
                });
                return res.status(200).json({ message: "Email Sent Successfully! Check your Email!" })
            }
        } else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get', auth.authenticateToken, checkRole.checkRole, async (req, res) => {
    var query = "SELECT * FROM user WHERE role='user'";
    connection.query(query, async (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let user = req.body;
    var query = "UPDATE user SET status=? where id=?";
    connection.query(query, [user.status, user.id], async (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "User ID does not exist" });
            }
            return res.status(200).json({ message: "User Updated Successfully" });
        } else {
            return res.status(500).json(err);
        }
    })
})

router.get('/checkToken', auth.authenticateToken, (req, res) => {
    return res.status(200).json({ messages: "true" });
})

router.post('/changePassword', auth.authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = res.locals.id;
    try {
        // Retrieve the user's hashed password from the database
        connection.query('SELECT password FROM user WHERE id = ?', [userId], async (error, results) => {
            if (error) {
                console.error('Error fetching user password:', error);
                return res.status(500).json({ message: 'Server error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const user = results[0];

            // Compare the provided old password with the stored hashed password
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the password in the database
            connection.query('UPDATE user SET password = ? WHERE id = ?', [hashedPassword, userId], (error, results) => {
                if (error) {
                    console.error('Error updating password:', error);
                    return res.status(500).json({ message: 'Server error' });
                }

                res.status(200).json({ message: 'Password updated successfully' });
            });
        });
    } catch (error) {
        console.error('Error in change password route:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router;