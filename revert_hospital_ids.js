require('dotenv').config();
const db = require('./config/db');

(async () => {
    try {
        console.log('Starting revert of hospital_id data...');

        // Create a map from hospitals.id to users.id (for hospital users)
        const [users] = await db.query('SELECT id, username FROM users WHERE role="hospital"');
        const [hospitals] = await db.query('SELECT id, hospital_name FROM hospitals');

        const hospitalToUserMap = {};
        for (const user of users) {
            const hospital = hospitals.find(h => h.hospital_name === user.username);
            if (hospital) {
                // Key is the small hospital.id, Value is the large users.id
                hospitalToUserMap[hospital.id] = user.id;
            }
        }

        console.log('Mapping dictionary (hospitals.id -> users.id):', hospitalToUserMap);

        // Revert donors table
        const [donors] = await db.query('SELECT id, hospital_id FROM donors');
        let donorsReverted = 0;
        for (const donor of donors) {
            // Only update if current hospital_id is one of the small hospital IDs (1-11)
            if (hospitalToUserMap[donor.hospital_id]) {
                const correctUserId = hospitalToUserMap[donor.hospital_id];
                await db.query('UPDATE donors SET hospital_id = ? WHERE id = ?', [correctUserId, donor.id]);
                donorsReverted++;
                console.log(`Reverted donor ${donor.id}: hospital_id ${donor.hospital_id} -> ${correctUserId}`);
            }
        }
        console.log(`Total donors reverted: ${donorsReverted}`);

        // Revert recipients table
        const [recipients] = await db.query('SELECT id, hospital_id FROM recipients');
        let recipientsReverted = 0;
        for (const recipient of recipients) {
            if (hospitalToUserMap[recipient.hospital_id]) {
                const correctUserId = hospitalToUserMap[recipient.hospital_id];
                await db.query('UPDATE recipients SET hospital_id = ? WHERE id = ?', [correctUserId, recipient.id]);
                recipientsReverted++;
                console.log(`Reverted recipient ${recipient.id}: hospital_id ${recipient.hospital_id} -> ${correctUserId}`);
            }
        }
        console.log(`Total recipients reverted: ${recipientsReverted}`);

        console.log('Revert completed successfully.');
    } catch(e) { 
        console.error('ERROR during revert:', e.message); 
    }
    process.exit();
})();
