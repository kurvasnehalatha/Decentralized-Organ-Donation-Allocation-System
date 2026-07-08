require('dotenv').config();
const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function syncHospitals() {
    try {
        console.log("🔍 Fetching hospitals...");
        const [hospitals] = await db.query('SELECT * FROM hospitals');
        
        const password = 'hospital123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log(`🚀 Syncing ${hospitals.length} hospitals to users table...`);
        
        const results = [];
        
        for (const h of hospitals) {
            // Use exact hospital name as username
            const username = h.hospital_name;
            
            // Check if user already exists
            const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
            
            if (existing.length === 0) {
                await db.query(
                    `INSERT INTO users (username, password, role, phone, address) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [username, hashedPassword, 'hospital', h.phone, h.address]
                );
                results.push({ hospital: h.hospital_name, username });
            } else {
                console.log(`ℹ️ User ${username} already exists, skipping.`);
            }
        }
        
        console.log("\n✅ Sync complete!");
        
        const fs = require('fs');
        let fileContent = "-----------------------------------------\n";
        fileContent += "Credentials for new hospitals:\n";
        fileContent += `Password for all: ${password}\n`;
        fileContent += "-----------------------------------------\n";
        results.forEach(r => {
            fileContent += `${r.hospital.padEnd(25)} | Username: ${r.username}\n`;
        });
        
        fs.writeFileSync('hospital_credentials.txt', fileContent);
        console.log(fileContent);
        
    } catch (error) {
        console.error("❌ Sync failed:", error.message);
    } finally {
        process.exit();
    }
}

syncHospitals();
