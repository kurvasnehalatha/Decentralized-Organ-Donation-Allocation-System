require('dotenv').config();
const db = require('./config/db');
const { addMedicalData } = require('./controllers/compatibilityController');

async function test() {
    const req = {
        params: { donorId: '13', recipientId: '1' },
        body: {
            hla_type: 'A2',
            cross_match_result: 'Compatible',
            recipient_urgency: 'High'
        }
    };
    const res = {
        status: function(code) {
            this.statusCode = code;
            return this;
        },
        json: function(data) {
            console.log('Response:', data);
            process.exit(0);
        }
    };

    try {
        await addMedicalData(req, res);
    } catch (err) {
        console.error('Test failed with error:', err);
        process.exit(1);
    }
}

test();
