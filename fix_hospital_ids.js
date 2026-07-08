require('dotenv').config();
const db = require('./config/db');

(async () => {
    try {
        console.log('Starting migration to fix hospital_id in donors and recipients tables...');

        // 1. Get the mapping of user_id (for hospitals) to hospital_id
        const [users] = await db.query('SELECT id, username FROM users WHERE role="hospital"');
        const [hospitals] = await db.query('SELECT id, hospital_name FROM hospitals');

        // Create a map from users.id to hospitals.id
        const userToHospitalMap = {};
        for (const user of users) {
            const hospital = hospitals.find(h => h.hospital_name === user.username);
            if (hospital) {
                userToHospitalMap[user.id] = hospital.id;
            }
        }

        console.log('Mapping dictionary (users.id -> hospitals.id):', userToHospitalMap);

        // 2. Fix donors table
        const [donors] = await db.query('SELECT id, hospital_id FROM donors');
        let donorsUpdated = 0;
        for (const donor of donors) {
            // If the donor's hospital_id matches a user ID (which was the bug), update it.
            if (userToHospitalMap[donor.hospital_id]) {
                const correctHospitalId = userToHospitalMap[donor.hospital_id];
                await db.query('UPDATE donors SET hospital_id = ? WHERE id = ?', [correctHospitalId, donor.id]);
                donorsUpdated++;
                console.log(`Updated donor ${donor.id}: hospital_id ${donor.hospital_id} -> ${correctHospitalId}`);
            }
        }
        console.log(`Total donors updated: ${donorsUpdated}`);

        // 3. Fix recipients table
        const [recipients] = await db.query('SELECT id, hospital_id FROM recipients');
        let recipientsUpdated = 0;
        for (const recipient of recipients) {
            if (userToHospitalMap[recipient.hospital_id]) {
                const correctHospitalId = userToHospitalMap[recipient.hospital_id];
                await db.query('UPDATE recipients SET hospital_id = ? WHERE id = ?', [correctHospitalId, recipient.id]);
                recipientsUpdated++;
                console.log(`Updated recipient ${recipient.id}: hospital_id ${recipient.hospital_id} -> ${correctHospitalId}`);
            }
        }
        console.log(`Total recipients updated: ${recipientsUpdated}`);

        console.log('Migration completed successfully.');
    } catch(e) { 
        console.error('ERROR during migration:', e.message); 
    }
    process.exit();
})();
