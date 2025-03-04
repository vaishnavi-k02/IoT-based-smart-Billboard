const express = require('express');
const cloudinary = require('cloudinary').v2;
const app = express();

cloudinary.config({
  cloud_name: 'dua3hrnae', // Ensure this matches your Cloudinary account
  api_key: '792157272915832',
  api_secret: '498OJxZfS1mf6nmYNcjFR91Gv1E'
});

app.use(express.static('public')); // Serve website files

app.get('/getAd', async (req, res) => {
    const category = req.query.category || "random"; // ✅ Default to "random" if no category
    console.log(`🔍 API Request Received for category: ${category}`);

    try {
        const result = await cloudinary.search
            .expression(`resource_type:video AND folder:ads AND tags=${category}`)  // ✅ Ensure correct category filter
            .sort_by("created_at", "desc")
            .max_results(5)
            .execute();

        console.log(`📡 Cloudinary Raw Response:`, JSON.stringify(result, null, 2));

        if (result.resources.length > 0) {
            const randomAd = result.resources[Math.floor(Math.random() * result.resources.length)].secure_url;
            console.log(`🎬 Sending Ad URL: ${randomAd}`);
            res.send(randomAd);
        } else {
            console.warn(`⚠️ No ads found for category: ${category}`);
            res.status(404).send("No ads available");
        }
    } catch (error) {
        console.error("❌ Error fetching ad:", error);
        res.status(500).send("Error fetching ad");
    }
});



// ✅ **This part was missing**
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}...`);
});
