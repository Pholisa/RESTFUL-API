//HTTP module allows Node.js to transfer data over the HTTP
const http = require('http');
//allows one to work with file systme on the computer.
//Uses of FS: reading, creating, updating, deleting, renaming files.
const fs = require ('fs');

//The JSON file that will be used as a database, path for JSON File
const path = './info.json';

//port on which the server will run
const PORT = 3000;

// Function to read the existing data
const readData = () => {
    try {
        // fs.readFileSync is a method from Node.js file system
        // The fs.readFile() method is used to read files on your computer. 
        // This is the path to the file being read
        //  UTF8 - Tells Node.js to read the file as a UTF-8 encoded string
        // ariable data will hold the raw content of the data.json file as a string
        const data = fs.readFileSync(path, 'utf8');
        // string needs to be converted back to a JavaScript array
        return JSON.parse(data);

       // If any error occurs in the try block, gets passed in if something goes wrong.
    } catch (err) {
        
        return 'Could not read movie details  :/';
    }
};

// Function to write data to the JSON file
const writeData = (data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

//creating a server using 'http.createServer()' function
//The functon takes two arguments: request object and response object.
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/items') {
        let body = '';

        // Listen for the data event
        req.on('data', chunk => {
            // Convert buffer to string
            body += chunk.toString(); 
        });

        // When all data is received
        req.on('end', () => {

            // Convert to JSON object
            const newItem = JSON.parse(body); 
            // Getting existing data
            const items = readData(); 

            // Adding the new movie to the data
            items.push(newItem);

            // Saving the updated data
            writeData(items);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Movie details created successfully' }));
        });
    } 
    else if (req.method === 'GET' && req.url === '/items') {
        // Get the movie from the file
        const items = readData(); 
        res.writeHead(200, { 'Content-Type': 'application/json' });
        // Send the movie as JSON
        res.end(JSON.stringify(items)); 
    }else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

server.listen(PORT, () => {
    console.log('Server is running on localhost:3000!')
})