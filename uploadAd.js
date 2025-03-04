const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
  cloud_name: 'dua3hrnae', // Ensure this matches your Cloudinary account
  api_key: '792157272915832',
  api_secret: '498OJxZfS1mf6nmYNcjFR91Gv1E'
});

// List of ads with categories
const ads = [
    { file: "ads/Sweater.mp4", tags: ["cold-ads"] },
    { file: "ads/Coffee.mp4", tags: ["cold-ads"] },
    { file: "ads/Hot.mp4", tags: ["hot-ads"] },
    { file: "ads/Icecream.mp4", tags: ["hot-ads"] },
    { file: "ads/Jwellery.mp4", tags: ["random-ads"] },
    { file: "ads/F1.mp4", tags: ["random-ads"] }
];
// Upload function
async function uploadAds() {
    for (const ad of ads) {
        try {
            const result = await cloudinary.uploader.upload(path.join(__dirname, ad.file), {
                resource_type: "video",
                folder: "ads",
                tags: ad.tags
            });
            console.log(`Uploaded ${ad.file}: ${result.secure_url}`);
        } catch (error) {
            console.error(`Error uploading ${ad.file}:`, error);
        }
    }
}

uploadAds();
