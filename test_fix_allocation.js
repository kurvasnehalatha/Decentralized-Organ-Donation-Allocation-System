require('dotenv').config();
const db = require('./config/db');
const { runAllocation } = require('./services/allocationService');

(async () => {
    try {
        console.log("Running allocation algorithm test...");
        const result = await runAllocation();
        
        if (result) {
            console.log("MATCH FOUND!");
            console.log("Donor ID:", result.donor_id);
            console.log("Recipient ID:", result.recipient_id);
            console.log("Organ:", result.organ_type);
            console.log("Blood Group:", result.blood_group);
            console.log("Match Score:", (result.score * 100).toFixed(2) + "%");
            
            // Detail the scores if possible or just log Success
            if (result.donor_id === 18 && result.recipient_id === 13) {
                console.log("SUCCESS: Correctly matched Donor #18 and Recipient #13!");
            } else {
                console.log("INFO: Found a different best match:", result);
            }
        } else {
            console.log("FAILURE: No match found.");
        }
    } catch (e) {
        console.error("ERROR:", e.message);
    }
    process.exit();
})();
