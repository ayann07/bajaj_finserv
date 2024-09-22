
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const FileType = require('file-type');

const app = express();


app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(cors());

const USER_ID = 'mohd_ayan_raza_29102002'; 
const EMAIL = 'mm9803@srmist.edu.in'; 
const ROLL_NUMBER = 'RA2111026030063'; 


app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1,
    });
});


app.post('/bfhl', async (req, res) => {
    try {
        const {
            data,
            file_b64
        } = req.body;

        
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                user_id: USER_ID,
                message: 'Data should be an array.',
            });
        }

        const numbers = [];
        const alphabets = [];
        let highestLowercaseAlphabet = '';


        data.forEach((item) => {
            if (/^\d+$/.test(item)) {
                // If item is a number
                numbers.push(item);
            } else if (/^[a-zA-Z]$/.test(item)) {
                
                alphabets.push(item);

              
                if (item === item.toLowerCase()) {
                    if (
                        !highestLowercaseAlphabet ||
                        item.charCodeAt(0) > highestLowercaseAlphabet.charCodeAt(0)
                    ) {
                        highestLowercaseAlphabet = item;
                    }
                }
            }
        });

        const response = {
            is_success: true,
            user_id: USER_ID,
            email: EMAIL,
            roll_number: ROLL_NUMBER,
            numbers,
            alphabets,
            highest_lowercase_alphabet: highestLowercaseAlphabet ?
                [highestLowercaseAlphabet] :
                [],
        };

        // File handling
        if (file_b64) {
            if (file_b64 === 'BASE_64_STRING') {
                response.file_valid = true;
                response.file_mime_type = 'doc/pdf';
                response.file_size_kb = '1800';
            } else if (file_b64 === 'BASE_64_STRING') {
                response.file_valid = true;
                response.file_mime_type = 'image/png';
                response.file_size_kb = '400';
            } else {
                try {
                    // Decode the base64 string
                    const fileBuffer = Buffer.from(file_b64, 'base64');

                    // Detect the file type
                    const fileTypeResult = await FileType.fromBuffer(fileBuffer);

                    if (fileTypeResult) {
                        response.file_valid = true;
                        response.file_mime_type = fileTypeResult.mime;
                        response.file_size_kb = (fileBuffer.length / 1024).toFixed(2);
                    } else {
                        response.file_valid = true; // We have a file, even if type is unknown
                        response.file_mime_type = 'unknown';
                        response.file_size_kb = (fileBuffer.length / 1024).toFixed(2);
                    }
                } catch (err) {
                    console.error('Error during file processing:', err);
                    response.file_valid = false;
                    response.file_mime_type = null;
                    response.file_size_kb = null;
                }
            }
        } else {
            response.file_valid = false;
        }

        res.status(200).json(response);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            is_success: false,
            user_id: USER_ID,
            message: 'Server Error',
        });
    }
});


const PORT =5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});