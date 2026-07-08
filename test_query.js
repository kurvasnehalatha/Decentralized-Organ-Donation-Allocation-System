require('dotenv').config();
const db = require('./config/db');

(async () => {
    try {
        const userId = 1; // Assuming user_id 1 is a donor
        console.log(`Running test query for user_id = ${userId}...`);
        
        const [requests] = await db.query(
         `SELECT d.*, h.username AS hospital_name, h.address AS hospital_address, h.phone AS hospital_phone
          FROM donors d
          LEFT JOIN users h ON d.hospital_id = h.id
          WHERE d.user_id = ?`,
         [userId]
        );
        
        console.log('Result length:', requests.length);
        if (requests.length > 0) {
            console.log('Sample request with hospital info:', {
                id: requests[0].id,
                organ_type: requests[0].organ_type,
                hospital_name: requests[0].hospital_name,
                hospital_phone: requests[0].hospital_phone
            });
        } else {
            // Let's just run it without WHERE user_id
            const [allRequests] = await db.query(
             `SELECT d.*, h.username AS hospital_name, h.address AS hospital_address, h.phone AS hospital_phone
              FROM donors d
              LEFT JOIN users h ON d.hospital_id = h.id
              LIMIT 1`
            );
            if (allRequests.length > 0) {
                console.log('Sample request (any user) with hospital info:', {
                    id: allRequests[0].id,
                    organ_type: allRequests[0].organ_type,
                    hospital_name: allRequests[0].hospital_name,
                    hospital_phone: allRequests[0].hospital_phone
                });
            }
        }
    } catch(e) { 
        console.error('ERROR:', e.message); 
    }
    process.exit();
})();
