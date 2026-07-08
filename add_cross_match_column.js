require('dotenv').config();
const db = require('./config/db');

async function addCrossMatchColumn() {
    try {
        console.log("🔍 Adding 'cross_match_result' column to 'compatibility_tests' table...");
        
        await db.query("ALTER TABLE compatibility_tests ADD COLUMN cross_match_result VARCHAR(50) DEFAULT 'Pending' AFTER hla_type");
        
        console.log("✅ Column added successfully!");
    } catch (error) {
        if (error.message.includes("Duplicate column name")) {
            console.log("ℹ️ Column 'cross_match_result' already exists.");
        } else {
            console.error("❌ Failed to add column:", error.message);
        }
    } finally {
        process.exit();
    }
}

addCrossMatchColumn();
