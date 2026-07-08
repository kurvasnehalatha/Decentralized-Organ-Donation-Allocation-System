require('dotenv').config();
const db = require('./config/db');
const fs = require('fs');

(async () => {
    let output = '';
    const log = (msg) => {
        console.log(msg);
        output += msg + '\n';
    };

    try {
        const [h] = await db.query('SELECT * FROM hospitals');
        log('--- HOSPITALS TABLE ---');
        h.forEach(row => log(JSON.stringify(row)));
        
        const [u] = await db.query('SELECT id, username, role FROM users WHERE role="hospital"');
        log('--- USERS TABLE (hospitals) ---');
        u.forEach(row => log(JSON.stringify(row)));
        
        const [d] = await db.query('DESCRIBE donors');
        log('--- DONORS SCHEMA ---');
        d.forEach(row => log(JSON.stringify(row)));

        const [r] = await db.query('DESCRIBE recipients');
        log('--- RECIPIENTS SCHEMA ---');
        r.forEach(row => log(JSON.stringify(row)));

        fs.writeFileSync('debug_output.txt', output);
        console.log('Output written to debug_output.txt');
    } catch(e) { 
        console.error('ERROR:', e.message); 
    }
    process.exit();
})();
