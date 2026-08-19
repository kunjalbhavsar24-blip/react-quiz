const express = require("express");
const router = express.Router();
const db = require("../db");

// Save Quiz History
router.post("/history/save", (req, res) => {

    const { email, category, totalQuestions, correctAnswers } = req.body;

    console.log("Request Body:", req.body);

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required."
        });
    }

    // Find user
    db.query(
        "SELECT id FROM users WHERE email = ?",
        [email],
        (err, users) => {

            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }

            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found."
                });
            }

            const userId = users[0].id;

            // Save history
            const sql = `
                INSERT INTO history
                (user_id, category, total_questions, correct_answers)
                VALUES (?, ?, ?, ?)
            `;

            db.query(
                sql,
                [userId, category, totalQuestions, correctAnswers],
                (err, result) => {

                    if (err) {
                        console.error(err);
                        return res.status(500).json(err);
                    }

                    res.status(201).json({
                        success: true,
                        message: "Quiz history saved successfully."
                    });

                }
            );

        }
    );

});

module.exports = router;