const fs = require('fs');
require('dotenv').config();
const db = require('./config/db');

(async () => {
    try {
        const [donors] = await db.query('SELECT id, user_id, organ_type, hospital_id FROM donors');
        const [hospitals] = await db.query('SELECT id, hospital_name FROM hospitals');
        const [users] = await db.query('SELECT id, username, role FROM users WHERE role="hospital"');
        
        fs.writeFileSync('donors_output.json', JSON.stringify({donors, hospitals, users}, null, 2));
    } catch(e) { 
        console.error('ERROR:', e.message); 
    }
    process.exit();
})();
