const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/categories", (req, res) => {
    db.query("SELECT * FROM categories", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

router.get("/questions/:categoryId", (req, res) => {
    const categoryId = req.params.categoryId;

    db.query(
        "SELECT * FROM questions WHERE category_id = ?",
        [categoryId],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});

module.exports = router;
