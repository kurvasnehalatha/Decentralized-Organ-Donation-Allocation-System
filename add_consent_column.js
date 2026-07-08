require('dotenv').config();
const db = require('./config/db');

async function addConsentColumn() {
    try {
        console.log("🔍 Adding 'consent' column to 'donors' table...");
        
        await db.query("ALTER TABLE donors ADD COLUMN consent BOOLEAN DEFAULT TRUE AFTER hospital_id");
        
        console.log("✅ Column added successfully!");
    } catch (error) {
        if (error.message.includes("Duplicate column name")) {
            console.log("ℹ️ Column 'consent' already exists.");
        } else {
            console.error("❌ Failed to add column:", error.message);
        }
    } finally {
        process.exit();
    }
}

addConsentColumn();
