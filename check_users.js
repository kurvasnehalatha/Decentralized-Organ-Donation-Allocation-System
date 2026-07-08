require('dotenv').config();
const db = require('./config/db');

(async () => {
    try {
        const [users] = await db.query('SELECT * FROM users WHERE id IN (1, 37, 51)');
        console.log("Users:", users);

        const [donors] = await db.query('SELECT id, user_id, hospital_id FROM donors WHERE id = 1');
        console.log("Donor 1:", donors);

    } catch(e) { 
        console.error('ERROR:', e.message); 
    }
    process.exit();
})();
