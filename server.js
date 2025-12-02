const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// --- 🕵️ DEBUG PROBE START ---
console.log("--- STARTING SERVER DEBUG PROBE ---");
console.log("Current Directory:", __dirname);
console.log("Files in root:", fs.readdirSync(__dirname));
try {
    console.log("Files in /converters:", fs.readdirSync(path.join(__dirname, 'converters')));
} catch (e) {
    console.error("❌ ERROR: Could not read 'converters' folder. Is it named 'Converters'?");
}
// --- 🕵️ DEBUG PROBE END ---

// Import the converter (Wrapped in try-catch to prevent immediate crash)
let convertOfficeToPdf;
try {
    // Check spelling carefully here!
    const module = require('./converters/officeToPdf'); 
    convertOfficeToPdf = module.convertOfficeToPdf;
    console.log("✅ Converter module loaded successfully!");
} catch (error) {
    console.error("❌ CRITICAL ERROR: Could not load converter module:", error.message);
}

const app = express();
const PORT = process.env.PORT || 10000;

// 1. Ensure Upload Directory Exists
const uploadDir = '/tmp/uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Middleware
app.use(cors()); 
app.use(express.json());
const upload = multer({ dest: uploadDir });

// 3. Health Check Route
app.get('/', (req, res) => {
    res.send(`<h1>PDF Converter API is Running 🚀</h1>`);
});

// 4. Route: Office to PDF
app.post('/convert/office-to-pdf', upload.single('file'), async (req, res) => {
    if (!convertOfficeToPdf) {
        return res.status(500).send("Server Error: Converter module failed to load on startup.");
    }
    try {
        if (!req.file) return res.status(400).send('No file uploaded.');
        const inputPath = req.file.path;
        const pdfPath = await convertOfficeToPdf(inputPath, uploadDir);
        res.download(pdfPath, `converted-${req.file.originalname}.pdf`, () => {
            try { 
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
            } catch (e) {}
        });
    } catch (error) {
        console.error("Conversion Error:", error);
        res.status(500).send('Error converting file.');
    }
});

// 5. Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});