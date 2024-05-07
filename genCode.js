//const mongoose = require('mongoose')
function generateCodes() {
    const codes = [];
    const usedCodes = new Set();

    while (codes.length < 100) {
        const code = generateCode(12);
        if (!usedCodes.has(code)) {
            usedCodes.add(code);
            codes.push(code);
        }
    }

    return codes;
}

function generateCode(length) {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += digits[Math.floor(Math.random() * digits.length)];
    }
    return code;
}

const generatedCodes = generateCodes();
console.log(generatedCodes);


// we update the code to also store the codes in a db

// const mongoose = require('mongoose');

// // Define the schema for the code object
// const codeSchema = new mongoose.Schema({
//     sn: String,
//     availability: { type: String, default: 'yes' }
// });

// // Create a mongoose model based on the schema
// const Code = mongoose.model('Code', codeSchema);

// // Function to generate codes and store them in MongoDB
// async function generateAndStoreCodes() {
//     try {
//         await mongoose.connect('mongodb+srv://efobikings:5jP5uiSFH4nSSbcz@cluster0.rledo98.mongodb.net/?retryWrites=true&w=majority', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });

//         // Generate codes and store them
//         const generatedCodes = generateCodes();
//         const codesToStore = generatedCodes.map(code => ({ sn: code, availability: 'yes' }));
//         await Code.insertMany(codesToStore);

//         console.log('Codes stored successfully.');
//     } catch (error) {
//         console.error('Error storing codes:', error);
//     } finally {
//         mongoose.disconnect();
//     }
// }

// function generateCodes() {
//     const codes = [];
//     const usedCodes = new Set();

//     while (codes.length < 100) {
//         const code = generateCode(12);
//         if (!usedCodes.has(code)) {
//             usedCodes.add(code);
//             codes.push(code);
//         }
//     }

//     return codes;
// }

// function generateCode(length) {
//     const digits = '0123456789';
//     let code = '';
//     for (let i = 0; i < length; i++) {
//         code += digits[Math.floor(Math.random() * digits.length)];
//     }
//     return code;
// }

// // Call the function to generate and store codes
// generateAndStoreCodes();
