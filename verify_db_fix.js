require('dotenv').config();
const db = require('./config/db');

async function verifyInsertion() {
    try {
        console.log("🔍 Verifying donor insertion with hospital_id from hospitals table...");

        // Use a known hospital ID from the previous debug output (e.g., ID 6 for AIIMS Delhi)
        const hospitalId = 6;
        const donorId = 1; // Existing user ID for donor

        // Try inserting a temporary donor record (we can delete it after)
        const [result] = await db.query(
            "INSERT INTO donors (user_id, organ_type, blood_group, hospital_id, status, consent) VALUES (?, ?, ?, ?, ?, ?)",
            [donorId, "Liver", "A+", hospitalId, "PENDING", true]
        );

        console.log(`✅ Successfully inserted donor record! New ID: ${result.insertId}`);

        // Cleanup: remove the test record
        await db.query("DELETE FROM donors WHERE id = ?", [result.insertId]);
        console.log("🗑️ Cleaned up test record.");
        
        console.log("🏁 Verification successful!");
    } catch (error) {
        console.error("❌ Verification failed:", error.message);
    } finally {
        process.exit();
    }
}

verifyInsertion();
