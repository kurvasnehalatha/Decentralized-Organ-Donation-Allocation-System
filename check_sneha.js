require('dotenv').config();
const db = require('./config/db');

(async () => {
    try {
        const [donors] = await db.query('SELECT * FROM donors WHERE id = 1');
        console.log("Donor #1 (donors table):", donors);

        if (donors.length > 0) {
            const hid = donors[0].hospital_id;
            const [users] = await db.query('SELECT id, username, role, phone FROM users WHERE id = ?', [hid]);
            console.log(`Hospital details from users table for hospital_id=${hid}:`, users);
        }

        const [sneha] = await db.query('SELECT id, username, role, phone FROM users WHERE username = "sneha"');
        console.log("User sneha details:", sneha);
        
    } catch(e) { 
        console.error('ERROR:', e.message); 
    }
    process.exit();
})();
