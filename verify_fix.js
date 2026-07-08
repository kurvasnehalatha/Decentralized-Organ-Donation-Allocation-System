require('dotenv').config();
const db = require('./config/db');
const { addCompatibility } = require('./controllers/compatibilityController');

async function test() {
    const req = {
        body: {
            donor_id: 13,
            hla_type: 'A2',
            urgency: 'High'
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
        await addCompatibility(req, res);
    } catch (err) {
        console.error('Test failed with error:', err);
        process.exit(1);
    }
}

test();
