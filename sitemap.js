const fs = require('fs');

// 1. CONFIGURATION
// Replace this with your actual domain where the app is hosted
const BASE_URL = 'https://badingchiwalani.com'; // Example domain
const OUTPUT_FILE = 'sitemap.xml';

// 2. DEFINE YOUR STATIC SCREENS
// These match the 'window.changeScreen' logic in your HTML
const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/#home', priority: '1.0', changefreq: 'daily' },
    { path: '/#sell', priority: '0.8', changefreq: 'monthly' },
    { path: '/#chat', priority: '0.5', changefreq: 'always' },
    { path: '/#notifications', priority: '0.5', changefreq: 'always' },
    { path: '/#profile', priority: '0.7', changefreq: 'weekly' },
    { path: '/#my-ads', priority: '0.6', changefreq: 'weekly' },
    { path: '/#wishlist', priority: '0.5', changefreq: 'weekly' }
];

// 3. FUNCTION TO GENERATE XML
const generateSitemap = async () => {
    console.log(`Generating sitemap for ${BASE_URL}...`);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    const date = new Date().toISOString();

    // Add Static Routes
    staticRoutes.forEach(route => {
        xml += `
    <url>
        <loc>${BASE_URL}${route.path}</loc>
        <lastmod>${date}</lastmod>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>`;
    });

    // ---------------------------------------------------------
    // OPTIONAL: DYNAMIC ADS (Requires Firebase Admin SDK)
    // ---------------------------------------------------------
    /* 
    // Uncomment this block if you set up firebase-admin to fetch all Ad IDs
    // and your app logic supports URL parameters like /?adId=123
    
    /*
    const admin = require('firebase-admin');
    const serviceAccount = require('./path/to/serviceAccountKey.json');
    
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    const db = admin.firestore();
    
    const adsSnapshot = await db.collection('ads').get();
    adsSnapshot.forEach(doc => {
        xml += `
    <url>
        <loc>${BASE_URL}/#details?id=${doc.id}</loc>
        <lastmod>${date}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
    });
    */

    xml += `
</urlset>`;

    // 4. WRITE TO FILE
    fs.writeFileSync(OUTPUT_FILE, xml);
    console.log(`✅ Sitemap generated successfully at: ${OUTPUT_FILE}`);
};

// Run the function
generateSitemap();
