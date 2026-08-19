const express = require("express");
const router = express.Router();
const db = require("../db");

// Get Quiz History
router.post("/result", (req, res) => {

    const email = req.body.email;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is"+email+ "required."+req
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

            // Fetch quiz history
            // Fetch quiz history with category name
            db.query(
                `SELECT
                    h.attempt_id,
                    c.category_name AS category,
                    h.total_questions,
                    h.correct_answers
                FROM history h
                INNER JOIN categories c
                    ON h.category = c.id
                WHERE h.user_id = ?
                ORDER BY h.attempt_id ASC`,
                [userId],
                (err, history) => {

                    if (err) {
                        console.error(err);
                        return res.status(500).json(err);
                    }

                    res.json({
                        success: true,
                        data: history
                    });

                }
            );

        }
    );

});

module.exports = router;