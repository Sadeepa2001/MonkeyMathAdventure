const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json()); // Allows parsing JSON requests

app.get("/banana-api", async (req, res) => {
    try {
        const response = await axios.get("http://marcconrad.com/uob/banana/api.php?out=json");

        if (response.data && response.data.question && response.data.solution !== undefined) {
            res.json(response.data);
        } else {
            res.status(500).json({ error: "Invalid response from the Banana API" });
        }
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: "Failed to fetch data from the API" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Proxy server running on http://localhost:${PORT}`));
