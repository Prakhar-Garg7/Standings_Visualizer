require("dotenv").config();
const express = require("express");
const cors = require("cors");

const standingsRoute = require("./routes/standings");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/standings", standingsRoute);

// Global error handler
app.use((err, req, res, next) => {
    console.error("Global error:", err);
    res.status(500).json({ error: err.message });
});

app.listen(5000, () => console.log("Server running on port 5000"));
