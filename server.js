const express = require('express');
const path = require('path');
const net = require('net');

const app = express();

// middleware to parse text/plain
app.use(express.text());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Handle POST requests to /process
app.post('/process', (req, res) => {

    const data = req.body; // The text data from the client
    console.log('Received data from website:', data);
    const result = data.split(/\r?\n/); // Split the data into lines
    console.log(result);
    
    let responses = []; // Array to collect responses
    let processedCount = 0; // Counter to track processed lines
    
    function handleConnection(row, index) {
        const client = new net.Socket(); // Create a new socket for each row
    
        client.connect(2024, 'localhost', function () {
            console.log('Connected to server');
            console.log('data sent to java: ' + client.write(row + '\n')); // Add a newline character to each row
        });
    
        client.on('data', function (tunnistettu) {
            console.log('Received from Java server:', tunnistettu.toString());
            responses[index] = tunnistettu.toString().trim();
            processedCount++;
    
            client.end();
    
            // Check if all lines have been processed
            if (processedCount === result.length) {
                // Join all responses into a single string with newline characters
                const finalResponse = responses.join('\n');
                // Send the final response back to the website
                res.send(finalResponse);
            }
        });
    
        client.on('close', function () {
            console.log('Connection closed');
        });
    
        client.on('error', function (err) {
            console.error('Error:', err.message);
        });
    }
    
    result.forEach((row, index) => {
        handleConnection(row, index);
    });    

});

// Serve the index.html file at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(2025, () => {
    console.log('node-server listening on port 2025');
});