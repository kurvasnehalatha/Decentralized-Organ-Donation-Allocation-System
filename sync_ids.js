const db = require("./config/db");
require("dotenv").config();

async function syncIds() {
    try {
        console.log("🔍 Fetching hospital mapping...");
        
        const [mapping] = await db.query(`
            SELECT h.id as old_id, u.id as new_id, h.hospital_name 
            FROM hospitals h 
            JOIN users u ON h.hospital_name = u.username 
            WHERE u.role = 'hospital'
        `);

        console.log("🗑️ Dropping existing foreign key constraints...");
        
        // Identify donor constraints
        const [donorConstraints] = await db.query(`
            SELECT CONSTRAINT_NAME 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_NAME = 'donors' AND COLUMN_NAME = 'hospital_id'
        `);
        for (const c of donorConstraints) {
            try { await db.query(`ALTER TABLE donors DROP FOREIGN KEY ${c.CONSTRAINT_NAME}`); } catch(e) {}
        }

        // Identify recipient constraints
        const [recipientConstraints] = await db.query(`
            SELECT CONSTRAINT_NAME 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_NAME = 'recipients' AND COLUMN_NAME = 'hospital_id'
        `);
        for (const c of recipientConstraints) {
            try { await db.query(`ALTER TABLE recipients DROP FOREIGN KEY ${c.CONSTRAINT_NAME}`); } catch(e) {}
        }

        console.log(`🚀 Syncing IDs for ${mapping.length} hospitals...`);

        for (const row of mapping) {
            console.log(`Syncing ${row.hospital_name}: Old ID ${row.old_id} -> New ID ${row.new_id}`);
            await db.query("UPDATE donors SET hospital_id = ? WHERE hospital_id = ?", [row.new_id, row.old_id]);
            await db.query("UPDATE recipients SET hospital_id = ? WHERE hospital_id = ?", [row.new_id, row.old_id]);
        }

        console.log("✨ Adding new foreign key constraints referencing 'users' table...");
        await db.query(`
            ALTER TABLE donors 
            ADD CONSTRAINT fk_donor_hospital_user 
            FOREIGN KEY (hospital_id) REFERENCES users(id) ON DELETE CASCADE
        `);
        await db.query(`
            ALTER TABLE recipients 
            ADD CONSTRAINT fk_recipient_hospital_user 
            FOREIGN KEY (hospital_id) REFERENCES users(id) ON DELETE CASCADE
        `);

        console.log("✅ ID sync complete and constraints updated!");
    } catch (err) {
        console.error("❌ Sync failed:", err.message);
    } finally {
        process.exit();
    }
}

syncIds();
