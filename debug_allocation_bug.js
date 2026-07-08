require('dotenv').config();
const db = require('./config/db');

(async () => {
    try {
        console.log("--- DONOR 18 ---");
        const [donor] = await db.query('SELECT * FROM donors WHERE id = 18');
        console.log(donor);

        console.log("--- RECIPIENT 13 ---");
        const [recipient] = await db.query('SELECT * FROM recipients WHERE id = 13');
        console.log(recipient);

        console.log("--- COMPATIBILITY TESTS ---");
        const [comp] = await db.query('SELECT * FROM compatibility_tests WHERE donor_id = 18 OR recipient_id = 13');
        console.log(comp);

        console.log("--- SCHEMA ---");
        const [schemaComp] = await db.query('DESCRIBE compatibility_tests');
        console.table(schemaComp);

    } catch(e) { 
        console.error('ERROR:', e.message); 
    }
    process.exit();
})();
