require('dotenv').config();
const db = require('./config/db');

async function fixForeignKeys() {
    try {
        console.log("🔍 Starting migration to fix hospital_id foreign keys...");

        // 1. Get constraint name for donors.hospital_id
        const [donorConstraints] = await db.query(`
            SELECT CONSTRAINT_NAME 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_NAME = 'donors' 
              AND COLUMN_NAME = 'hospital_id' 
              AND REFERENCED_TABLE_NAME = 'users'
        `);

        for (const c of donorConstraints) {
            console.log(`🗑️ Dropping donor constraint: ${c.CONSTRAINT_NAME}`);
            await db.query(`ALTER TABLE donors DROP FOREIGN KEY ${c.CONSTRAINT_NAME}`);
        }

        // 2. Get constraint name for recipients.hospital_id
        const [recipientConstraints] = await db.query(`
            SELECT CONSTRAINT_NAME 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_NAME = 'recipients' 
              AND COLUMN_NAME = 'hospital_id' 
              AND REFERENCED_TABLE_NAME = 'users'
        `);

        for (const c of recipientConstraints) {
            console.log(`🗑️ Dropping recipient constraint: ${c.CONSTRAINT_NAME}`);
            await db.query(`ALTER TABLE recipients DROP FOREIGN KEY ${c.CONSTRAINT_NAME}`);
        }

        // 3. Add correct constraints referencing 'hospitals' table
        console.log("✨ Adding correct foreign key constraints referencing 'hospitals' table...");
        
        await db.query(`
            ALTER TABLE donors 
            ADD CONSTRAINT fk_donor_hospital 
            FOREIGN KEY (hospital_id) REFERENCES hospitals(id) 
            ON DELETE CASCADE
        `);

        await db.query(`
            ALTER TABLE recipients 
            ADD CONSTRAINT fk_recipient_hospital 
            FOREIGN KEY (hospital_id) REFERENCES hospitals(id) 
            ON DELETE CASCADE
        `);

        console.log("✅ Migration completed successfully!");
    } catch (error) {
        console.error("❌ Migration failed:", error.message);
    } finally {
        process.exit();
    }
}

fixForeignKeys();
