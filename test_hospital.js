require('dotenv').config();
const db = require('./config/db');

(async () => {
    try {
        const [donors] = await db.query('SELECT * FROM donors WHERE user_id = 1');
        console.log("Donors for user_id = 1:", donors);

        if (donors.length > 0) {
            const hospitalId = donors[0].hospital_id;
            const [users] = await db.query('SELECT * FROM users WHERE id = ?', [hospitalId]);
            console.log(`Hospital data in users table (id=${hospitalId}):`, users);
            
            const [hospitals] = await db.query('SELECT * FROM hospitals WHERE id = ?', [hospitalId]);
            console.log(`Hospital data in hospitals table (id=${hospitalId}):`, hospitals);

            const [usersRoleHospital] = await db.query('SELECT id, username FROM users WHERE role="hospital"');
            console.log("All hospitals in users table:", usersRoleHospital);
            
            const [allHospitals] = await db.query('SELECT id, hospital_name FROM hospitals');
            console.log("All hospitals in hospitals table:", allHospitals);
        }
    } catch(e) { 
        console.error('ERROR:', e.message); 
    }
    process.exit();
})();
