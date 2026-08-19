const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/questions/:id", (req, res) => {
    const categoryId = parseInt(req.params.id, 10);

    if (isNaN(categoryId)) {
        return res.status(400).json({ error: "Invalid Category ID format" });
    }
    // Hardcode the LIMIT 10 directly into the SQL string safely
    const sql = "SELECT * FROM questions WHERE category_id = ? LIMIT 10"; // Adjust the limit as needed
    
    db.query(sql, [categoryId], (err, result) => {
        if (err) {
            console.error("Database Error:", err); 
            return res.status(500).json({ error: "Internal server error fetching questions." }); 
        }
        res.json(result);
    });
});

module.exports = router;