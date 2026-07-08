require('dotenv').config();
const db = require('./config/db');
const { runAllocation } = require('./services/allocationService');
const { recordOnBlockchain } = require('./services/blockchainService');

(async () => {
    try {
        console.log("Starting final allocation process...");
        let matchFound = true;
        let matchCount = 0;
        
        while (matchFound) {
            const result = await runAllocation();
            if (result) {
                console.log(`MATCH #${matchCount + 1} FOUND:`, result.donor_id, "->", result.recipient_id);
                
                console.log("Recording on blockchain...");
                const txHash = await recordOnBlockchain(result.donor_id, result.recipient_id);
                console.log("Blockchain TX Hash:", txHash);
                
                console.log("Saving to database...");
                await db.query(
                    "INSERT INTO allocations (donor_id, recipient_id, score, tx_hash, timestamp) VALUES (?, ?, ?, ?, NOW())",
                    [result.donor_id, result.recipient_id, result.score, txHash]
                );
                
                console.log("Updating statuses...");
                await db.query("UPDATE donors SET status='ALLOCATED' WHERE id=?", [result.donor_id]);
                await db.query("UPDATE recipients SET status='ALLOCATED' WHERE id=?", [result.recipient_id]);
                
                matchCount++;
            } else {
                matchFound = false;
            }
        }
        
        if (matchCount > 0) {
            console.log(`ALLOCATION COMPLETED: ${matchCount} pair(s) processed.`);
        } else {
            console.log("No pending matches found.");
        }
    } catch (e) {
        console.error("FATAL ERROR:", e.message);
    }
    process.exit();
})();
