//HTTP module allows Node.js to transfer data over the HTTP
const http = require('http');
//allows one to work with file systme on the computer.
//Uses of FS: reading, creating, updating, deleting, renaming files.
const fs = require ('fs');

//The JSON file that will be used as a database, path for JSON File
const path = './movies-info.json';

//port on which the server will run
const PORT = 3500;

// Function to read the existing data
const readData = () => {
    try {
        // fs.readFileSync is a method from Node.js file system
        // The fs.readFile() method is used to read files on your computer. 
        // This is the path to the file being read
        //  UTF8 - Tells Node.js to read the file as a UTF-8 encoded string
        // variable data will hold the raw content of the data.json file as a string
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
    // 2: This is the space parameter, which specifies the number of spaces to use for indentation in the output JSON string.
};

//creating a server using 'http.createServer()' function
//The functon takes two arguments: request object and response object.
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/movies') {
        let body = '';

        // Listening for the data event, the event listener is set up for 'data' on the requst object
        req.on('data', chunk => {
            // Converting buffer to string
            body += chunk.toString(); 
        });

        // When all of the data data is received
        req.on('end', () => {

            // Converting to JSON object
            const newMovie = JSON.parse(body); 
            // Getting existing data
            const movies = readData(); 

            // Adding the new movie to the data
            movies.push(newMovie);

            // Saving the updated data
            writeData(movies);

            //201 is the status code of the repose meaning OK
            res.writeHead(201, { 'Content-Type': 'application/json' });
            // Ends the response and send 'Movie detail created successfully' message.
            res.end(JSON.stringify({ message: 'Movie details created successfully' }));
        });
    } 
    else if (req.method === 'GET' && req.url === '/movies') {
        // Get the movies from the file
        const movies = readData(); 
        //200 is the status code of the repose meaning OK
        res.writeHead(200, { 'Content-Type': 'application/json' });
        // Send the movie as JSON
        res.end(JSON.stringify(movies)); 
    } 
    else if (req.method === 'GET' && req.url.startsWith('/movies/')) {
        // Extracting the ID from the URL
        const id = req.url.split('/')[2]; 
        // Gets the data already exists 
        const movies = readData(); 

        // Finding the movie by id
        const movie = movies.find(movie => movie.id === id);

        if (movie) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(movie)); // Send the movie as JSON
        } 
    } 
    else if (req.method === 'DELETE' && req.url.startsWith('/movies/')) {
        // Extract the ID from the URL
        const id = req.url.split('/')[2]; 
        // Get existing data
        const movies = readData(); 

        // Find the movie by id and remove it
        const updatedMovies = movies.filter(movies => movies.id !== id);

        // If the length has changed, that means an item was deleted
        if (updatedMovies.length !== movies.length) {
            // Save the updated data
            writeData(updatedMovies); 

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `Item with id ${id} deleted successfully` }));
        } 
    } 
    else {

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

//listening to incoming requests
server.listen(PORT, () => {
    console.log('Server is running on localhost:3500!')
})