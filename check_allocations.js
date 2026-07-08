const fs = require('fs');
require('dotenv').config();
const db = require('./config/db');

(async () => {
    try {
        const [allocs] = await db.query('SELECT * FROM allocations');
        const [donors] = await db.query('SELECT * FROM donors WHERE id IN (SELECT donor_id FROM allocations)');
        const [users] = await db.query('SELECT id, username, phone, role FROM users WHERE id IN (SELECT user_id FROM donors) OR id IN (SELECT hospital_id FROM donors)');
        
        fs.writeFileSync('db_dump.json', JSON.stringify({ allocs, donors, users }, null, 2));
    } catch(e) { 
        console.error('ERROR:', e.message); 
    }
    process.exit();
})();
