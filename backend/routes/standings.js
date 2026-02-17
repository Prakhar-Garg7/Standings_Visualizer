const express = require("express");
const router = express.Router();

const { fetchStandings } = require("../services/codeforcesService");

router.get("/:contestId", async (req, res) => {
    try {
        const contestId = Number(req.params.contestId);

        if (isNaN(contestId)) {
            return res.status(400).json({ error: "Invalid contest ID" });
        }

        // Always fetch fresh data
        const freshData = await fetchStandings(contestId);
        res.json(freshData);
    } catch (error) {
        console.error("Error in standings route:", error.message);
        res.status(500).json({ error: "Failed to fetch standings", details: error.message });
    }
});

module.exports = router;
