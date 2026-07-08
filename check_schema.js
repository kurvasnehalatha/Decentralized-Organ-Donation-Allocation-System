require('dotenv').config();
const db = require('./config/db');

(async () => {
    try {
        const [donors] = await db.query('SHOW CREATE TABLE donors');
        console.log('--- DONORS ---');
        console.log(donors[0]['Create Table']);
        
        const [recipients] = await db.query('SHOW CREATE TABLE recipients');
        console.log('--- RECIPIENTS ---');
        console.log(recipients[0]['Create Table']);
        
    } catch(e) { 
        console.error('ERROR:', e.message); 
    }
    process.exit();
})();
