const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");


router.post("/register", async (req, res) => {

    const { name, email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if (result.length > 0) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.query(
                "INSERT INTO users(name,email,password) VALUES(?,?,?)",
                [name, email, hashedPassword],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            message: "Registration Failed"
                        });
                    }

                    res.json({
                        success: true,
                        message: "Registration Successful"
                    });

                }
            );

        }
    );

});
router.post("/login", (req, res) => {

    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if (result.length === 0) {
                return res.status(401).json({
                    message: "User not found"
                });
            }

            const user = result[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({
                    message: "Wrong Password"
                });
            }

            res.json({
                success: true,
                message: "Login Successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });

        }
    );

});

module.exports = router;