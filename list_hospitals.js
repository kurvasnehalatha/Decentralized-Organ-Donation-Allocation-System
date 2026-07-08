require('dotenv').config();
const db = require('./config/db');

async function listHospitalUsers() {
    try {
        const [users] = await db.query("SELECT username FROM users WHERE role = 'hospital'");
        
        console.log("-----------------------------------------");
        console.log("Credentials for Hospital Login:");
        console.log("Password for all: hospital123");
        console.log("-----------------------------------------");
        users.forEach(u => {
            console.log(`Username: ${u.username}`);
        });
        console.log("-----------------------------------------");
        
    } catch (error) {
        console.error("❌ Failed to list users:", error.message);
    } finally {
        process.exit();
    }
}

listHospitalUsers();
