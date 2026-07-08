const fs = require('fs');
require('dotenv').config();
const db = require('./config/db');

(async () => {
    try {
        const [allocations] = await db.query(
            `SELECT a.id, d.id as donor_id, d.user_id as donor_user_id, d.hospital_id as donor_hospital_id,
                    u_donor.username AS donor_name, u_donor.phone AS donor_phone,
                    h_donor.username AS donor_hospital, h_donor.phone AS donor_hospital_phone
             FROM allocations a
             JOIN donors d ON a.donor_id = d.id
             JOIN users u_donor ON d.user_id = u_donor.id
             LEFT JOIN users h_donor ON d.hospital_id = h_donor.id`
        );
        fs.writeFileSync('allocation_dump.json', JSON.stringify(allocations, null, 2));
    } catch(e) { 
        console.error('ERROR:', e.message); 
    }
    process.exit();
})();
