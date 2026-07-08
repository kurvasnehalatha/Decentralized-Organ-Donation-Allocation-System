require('dotenv').config();
const db = require('./config/db');

(async () => {
    try {
        const [donors] = await db.query('SELECT id, user_id, organ_type, hospital_id FROM donors');
        console.log('--- DONORS ---');
        console.table(donors);
        
        const [hospitals] = await db.query('SELECT id, hospital_name FROM hospitals');
        console.log('--- HOSPITALS ---');
        console.table(hospitals);
        
        const [users] = await db.query('SELECT id, username, role FROM users WHERE role="hospital"');
        console.log('--- USERS (hospitals) ---');
        console.table(users);
        
    } catch(e) { 
        console.error('ERROR:', e.message); 
    }
    process.exit();
})();
