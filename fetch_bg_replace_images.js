// fetch_bg_replace_images.js
// Usage: node fetch_bg_replace_images.js
// Requires: npm install @cloudinary/assets

const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');

// Configure from environment or .env
cloudinary.config({
  cloud_name: '<your_cloudinary_cloud_name>',
  api_key: '<your_cloudinary_api_key>',
  api_secret: '<your_cloudinary_api_secret>',
  secure: true
});

const FOLDER = 'BG_replace';
const OUTPUT = 'bg_replace_images.json';

async function fetchAllImages() {
  let nextCursor = undefined;
  let allImages = [];
  do {
    const res = await cloudinary.search
      .expression(`folder:${FOLDER}`)
      .sort_by('public_id','asc')
      .max_results(100)
      .next_cursor(nextCursor)
      .execute();
    if (res.resources && res.resources.length > 0) {
      allImages.push(...res.resources.map(img => img.public_id + '.' + img.format));
    }
    nextCursor = res.next_cursor;
  } while (nextCursor);
  return allImages;
}

fetchAllImages()
  .then(list => {
    fs.writeFileSync(OUTPUT, JSON.stringify(list, null, 2));
    console.log(`Wrote ${list.length} images to ${OUTPUT}`);
  })
  .catch(err => {
    console.error('Error fetching images:', err);
    process.exit(1);
  }); 