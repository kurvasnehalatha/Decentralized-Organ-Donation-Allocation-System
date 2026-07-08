const fs = require('fs');
require('dotenv').config();
const db = require('./config/db');

(async () => {
    try {
        const [donors] = await db.query('SHOW CREATE TABLE donors');
        const [recipients] = await db.query('SHOW CREATE TABLE recipients');
        const [allocations] = await db.query('SHOW CREATE TABLE allocations');
        
        fs.writeFileSync('schema_output.json', JSON.stringify({
            donors: donors[0]['Create Table'],
            recipients: recipients[0]['Create Table'],
            allocations: allocations[0]['Create Table']
        }, null, 2));
    } catch(e) { 
        console.error('ERROR:', e.message); 
    }
    process.exit();
})();
